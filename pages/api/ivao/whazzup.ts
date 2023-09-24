import { AxiosError } from 'axios'
import axios from 'config/axios'
import { mongoose } from 'lib/mongoose'
import withAuth from 'lib/withAuth'
import { PilotModel, AtcModel } from 'models'
import Live, { ILive } from 'models/Live'
import { Pilot } from 'models/Pilot'
import moment, { Moment } from 'moment'
import { NextApiRequest, NextApiResponse } from 'next'
import { Atc, IvaoPilot, LastTrackStateEnum } from 'types'

let nextCall: Moment

// const logDiferentAircrafts = (clients: IVAOClients) => {
//   const result = clients.pilots.reduce((acc, curr) => {
//     const currentCode = curr.flightPlan.aircraft.icaoCode
//     const accCode = acc[currentCode]

//     return accCode ? { ...acc, [currentCode]: acc[currentCode] + 1 } : { ...acc, [currentCode]: 1 }
//   }, {} as Record<string, number>)
//   console.log({ result })
// }

const checkDuplicates = async (Model: typeof AtcModel | typeof PilotModel, field: string) => {
  const pipeline = [
    {
      $group: {
        _id: field,
        count: { $sum: 1 }
      }
    },
    {
      $match: {
        count: { $gt: 1 } // Match groups with count greater than 1 (duplicates)
      }
    }
  ]

  return await Model.aggregate(pipeline)
    .then((duplicates) => {
      if (duplicates.length > 0) {
        console.log(`Duplicate ${field} found:`)
        duplicates.forEach((duplicate) => {
          console.log(`${field}: ${duplicate._id}, Count: ${duplicate.count}`)
        })
        return true
      } else {
        console.log(`No duplicate ${field} found.`)
        return false
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

const removeDuplicates = async (Model: typeof AtcModel | typeof PilotModel, field: string) => {
  const pipeline = [
    {
      $group: {
        _id: field,
        count: { $sum: 1 },
        duplicates: { $push: '$_id' } // Store the _id values of duplicates
      }
    },
    {
      $match: {
        count: { $gt: 1 } // Match groups with count greater than 1 (duplicates)
      }
    }
  ]

  await Model.aggregate(pipeline)
    .then(async (duplicates) => {
      if (duplicates.length > 0) {
        console.log(`Duplicate ${field} found:`)
        for (const duplicate of duplicates) {
          console.log(`${field}: ${duplicate._id}, Count: ${duplicate.count}`)
          // Delete duplicates, keeping the oldest one
          const [, ...duplicateIds] = duplicate.duplicates
          await Model.deleteMany({ _id: { $in: duplicateIds } })
          console.log(`Deleted duplicates with ${field} ${duplicate._id}`)
        }
      } else {
        console.log(`No duplicate ${field} found.`)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

const batchSize = 50 // You can adjust this based on your needs

// Function to process a batch of updates
async function processBatchAtcs(batch: Atc[]) {
  const bulkOps = []

  for (const atc of batch) {
    const updateOperation = {
      replaceOne: {
        filter: { callsign: atc.callsign },
        replacement: atc
      }
    }

    bulkOps.push(updateOperation)
  }

  await AtcModel.bulkWrite(bulkOps)
}

async function processBatchPilots(batch: Pilot[], lives: ILive[]) {
  const bulkOps = []

  for (const pilot of batch) {
    const updateOperation = {
      replaceOne: {
        filter: { userId: pilot.userId },
        replacement: pilot
      }
    }

    bulkOps.push(updateOperation)
  }

  console.log('BULK OPS', bulkOps.length)
  await AtcModel.bulkWrite(bulkOps)
}

const getCreateAndUpdateAtcs = async (atcs: Atc[]): Promise<{ update: Atc[]; create: Atc[] }> => {
  const current = await AtcModel.find<Atc>({ callsign: { $in: atcs.map((atc) => atc.callsign) } })
  const create = atcs.filter((atc) => !current.some((a) => a.callsign === atc.callsign))
  const update = atcs.filter((atc) => current.some((a) => a.callsign === atc.callsign))

  return { update, create }
}

const getCreateAndUpdatePilots = async (pilots: Pilot[]): Promise<{ update: Pilot[]; create: Pilot[] }> => {
  const current = await PilotModel.find<Pilot>({ userId: { $in: pilots.map((pilot) => pilot.userId) } })
  const create = pilots.filter((pilot) => !current.some((a) => a.userId === pilot.userId))
  const update = pilots.filter((pilot) => current.some((a) => a.userId === pilot.userId))

  return { update, create }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }
  const now = moment()

  if (!nextCall || nextCall.isBefore(now)) {
    nextCall = now.add(20, 'seconds')
    try {
      console.info('requesting IVAO data at %s', now.format('HH:mm:ss'))

      const response = await axios.get<{ clients: { atcs: Atc[]; pilots: IvaoPilot[] } }>(
        'https://api.ivao.aero/v2/tracker/whazzup'
      )
      // logDiferentAircrafts(response.data.clients)

      if (response.data.clients.atcs) {
        if (await checkDuplicates(AtcModel, '$callsign')) {
          removeDuplicates(AtcModel, '$callsign')
        }
        const { atcs } = response.data.clients
        const { update, create } = await getCreateAndUpdateAtcs(atcs)

        if (create.length) {
          try {
            await AtcModel.insertMany(create, { ordered: false })
          } catch (err) {
            res.status(500).send(err)
            return
          }
        }

        if (update.length) {
          const totalItems = update.length
          for (let i = 0; i < totalItems; i += batchSize) {
            const batch = update.slice(i, i + batchSize)
            try {
              await processBatchAtcs(batch)
            } catch (err) {
              res.status(500).send(err)
              break
            }
          }
        }
      }

      if (response.data.clients.pilots) {
        if (await checkDuplicates(PilotModel, '$userId')) {
          await removeDuplicates(PilotModel, '$userId')
        }
        const { pilots } = response.data.clients
        const { update, create } = await getCreateAndUpdatePilots(pilots)

        if (create.length) {
          try {
            await PilotModel.insertMany(create, { ordered: false })
          } catch (err) {
            res.status(500).send(err)
            return
          }
        }

        const lives = await Live.find({})

        if (update.length) {
          const totalItems = update.length
          for (let i = 0; i < totalItems; i += batchSize) {
            const batch = update.slice(i, i + batchSize)
            try {
              await processBatchPilots(batch, lives)
            } catch (err) {
              res.status(500).send(err)
              break
            }
          }
        }

        const oneHourAgo = new Date()
        oneHourAgo.setUTCHours(oneHourAgo.getUTCHours() - 4)
        const toKeep = new Set()
        lives.forEach((l) => toKeep.add(l.callsign))
        update.forEach((a) => toKeep.add(a.callsign))
        create.forEach((a) => toKeep.add(a.callsign))

        const deleteItem = await PilotModel.find({ callsign: { $nin: Array.from(toKeep) } })

        console.log('PILOTS TO DELETE', deleteItem.length)

        if (deleteItem.length) {
          await PilotModel.deleteMany({ callsign: { $nin: Array.from(toKeep) } })
        }
      }

      res.status(200).end()
    } catch (err) {
      console.error((err as AxiosError).message)
      res.status(500).send((err as AxiosError).message)
    } finally {
      // await mongoose.disconnect()
      return
    }
  } else {
    // await mongoose.disconnect()
    res.status(200).end()
  }
}

export default withAuth(handler)
