import { connectDB } from 'lib/mongoose'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Cargo, { ICargo } from 'models/Cargo'
import Live, { LastTrackStateEnum } from 'models/Live'
import { NextApiResponse } from 'next'
import { CargoDetail, CargoStatus, CargoStep } from 'types'
import sdk from 'lib/twSdk'
import User from 'models/User'
import { coinTokenAddress } from 'contracts/address'

const validateFullFlight = (steps: CargoStep[]) => {
  let counter = 0

  steps.forEach((step) => {
    if (step.name === LastTrackStateEnum.Boarding) {
      counter++
    } else if (step.name === LastTrackStateEnum.Departing) {
      counter++
    } else if (step.name === LastTrackStateEnum.Initial_Climb) {
      counter++
    } else if (step.name === LastTrackStateEnum.En_Route) {
      counter++
    } else if (step.name === LastTrackStateEnum.Approach) {
      counter++
    } else if (step.name === LastTrackStateEnum.Landed) {
      counter++
    } else if (step.name === LastTrackStateEnum.On_Blocks) {
      counter++
    }

    if (counter === 7) {
      return 3
    } else if (counter > 5) {
      return 2
    } else if (counter > 4) {
      return 1
    }
    return 0
  })
}

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  } else if (!req.body.state) {
    res.status(400).end()
    return
  }

  const lastTrackState = req.body.state as LastTrackStateEnum

  try {
    await connectDB()
    const live = await Live.findOne({ userId: req.id })
    if (!live) {
      res.status(204).end()
      return
    }

    if (live.track.some((step: CargoDetail) => step.name === LastTrackStateEnum.On_Blocks)) {
      const isValid = validateFullFlight(live.track)
      const cargo = await Cargo.findOneAndUpdate<ICargo>(
        { userId: req.id },
        { status: CargoStatus.COMPLETED, rewarded: false }
      )
      if (!cargo) {
        throw new Error('Missing cargo after finish flight')
      }

      const user = await User.findOne({ userId: req.id })
      if (!user) {
        throw new Error('Missing using after finish flight')
      }

      await sdk.wallet.transfer(user.address, cargo.prize, coinTokenAddress)
      await Cargo.findOneAndUpdate<ICargo>({ userId: req.id }, { rewarded: true })

      res.status(200).end()
      return
    }

    if (live.track.some((step: CargoDetail) => step.name === lastTrackState)) {
      await Live.findOneAndUpdate(
        { _id: live._id, 'track.name': lastTrackState },
        { $addToSet: { track: { value: new Date() } } },
        { new: true }
      )

      res.status(202).end
      return
    }

    const updated = await Live.findOneAndUpdate(
      { userId: req.id },
      { status: lastTrackState, $addToSet: { track: { name: lastTrackState, value: new Date() } } },
      { new: true }
    )
    res.status(201).send(updated)
    return
  } catch (error) {
    console.error('Live state update error =>', error)
    res.status(500).end()
  }
}

export default withAuth(handler)
