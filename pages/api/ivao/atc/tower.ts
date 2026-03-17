import { AxiosError } from 'axios'
import { ivaoInstance } from 'config/axios'
import withAuth from 'lib/withAuth'
import { NextApiRequest, NextApiResponse } from 'next'
import { ActiveAtc } from 'types'
import { reduceAtcTower } from 'utils'
import Atcs from 'models/Atc'
import moment from 'moment'
import { AnyBulkWriteOperation } from 'mongoose'

const bulkOps: AnyBulkWriteOperation<ActiveAtc>[] = []

const updateTowers = async (towers: ActiveAtc[]) => {
  try {
    towers.forEach((doc) => {
      bulkOps.push({
        updateOne: {
          filter: { callsign: doc.callsign },
          update: { $set: doc },
          upsert: true
        }
      })
    })

    await Atcs.bulkWrite(bulkOps)
  } catch (error) {
    console.error('While updating towers with bulk', error)
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.time('TOWER')
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }

  try {
    const query = req.query.callsign ? { callsign: { $regex: req.query.callsign as string, $options: 'i' } } : {}
    const atcs = await Atcs.find<ActiveAtc>(query)

    const now = moment()
    const expiry = moment(atcs[0].updatedAt).add(1, 'minute')
    const needUpdate = now.isAfter(expiry)

    if (atcs.length && !needUpdate) {
      console.timeEnd('TOWER')
      res.status(200).send(atcs)
      return
    }
  } catch (error) {
    console.error('error =>', error)
    res.status(500).end()
  }

  console.log('ACTUALIZANDO TORRES DE CONTROL')

  try {
    const { data } = await ivaoInstance.get<ActiveAtc[]>('/v2/tracker/now/atc', { timeout: 2000 })
    const towers = data.reduce(reduceAtcTower, [])

    await updateTowers(towers).then(
      async () => await Atcs.deleteMany({ callsign: { $nin: towers.map((doc) => doc.callsign) } })
    )

    console.timeEnd('TOWER')
    res.status(200).send(towers)
  } catch (err) {
    const error = err as AxiosError<{ message: string }>
    if (error.response?.data.message === 'Unauthorized') {
      res.status(401).send(error.response.data)
      return
    } else if (error.code === 'ECONNABORTED') {
      res.status(402).end()
    }
    res.status(400).send(error.response?.data)
  }
}

export default withAuth(handler)
