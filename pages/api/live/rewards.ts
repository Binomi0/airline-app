import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import sdk from 'lib/twSdk'
import { coinTokenAddress } from 'contracts/address'
import User from 'models/User'
import Cargo, { ICargo } from 'models/Cargo'
import { CargoStatus, CargoStep, LastTrackStateEnum } from 'types'
import Live from 'models/Live'

const validateFullFlight = (steps: CargoStep[]): number => {
  let counter = 0
  let result = 0

  steps.forEach((step) => {
    if (step.name === LastTrackStateEnum.Boarding) {
      counter++
    } else if (step.name === LastTrackStateEnum.Departing) {
      counter++
    } else if (step.name === 'Initial Climb') {
      counter++
    } else if (step.name === 'En Route') {
      counter++
    } else if (step.name === LastTrackStateEnum.Approach) {
      counter++
    } else if (step.name === LastTrackStateEnum.Landed) {
      counter++
    } else if (step.name === 'On Blocks') {
      counter++
    }

    if (counter === 7) {
      result = 30
    } else if (counter > 6) {
      result = 15
    }
  })

  return result
}

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  } else if (req.headers['x-api-key'] !== process.env.PRIVATE_API_KEY) {
    res.status(403).end()
    return
  }

  try {
    const cargo = await Cargo.findOne({ userId: req.id, status: CargoStatus.STARTED })
    if (!cargo) throw new Error(`Missing cargo for userId: ${req.id}`)
    else if (cargo.isRewarded) {
      res.status(200).end()
      return
    }
    const user = await User.findById(req.id)
    if (!user) throw new Error(`Missing user for userId: ${req.id}`)

    const live = await Live.findOne({ userId: req.id })
    if (!live) throw new Error(`Missing live for userId: ${req.id}`)

    const score = validateFullFlight(live.track)
    if (score) {
      if (cargo.status !== CargoStatus.ABORTED && !cargo.isRewarded) {
        const remote = cargo.remote ? 3 : 1
        const prize = (cargo.prize / remote) * (1 + score / 100)
        await sdk.wallet.transfer(user.address, cargo.prize, coinTokenAddress)

        await Promise.all([
          Cargo.findByIdAndUpdate<ICargo>(cargo._id, {
            isRewarded: true,
            status: CargoStatus.COMPLETED,
            score,
            rewards: prize
          }),
          Live.findOneAndDelete({ userId: req.id })
        ])
        res.status(201).end()
        return
      }
    } else {
      res.status(203).end()
      return
    }

    res.status(202).end()
  } catch (error) {
    console.error('ERROR =>', error)
    res.status(500).end()
  }
}

export default withAuth(handler)
