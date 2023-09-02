import { connectDB } from 'lib/mongoose'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Cargo, { ICargo } from 'models/Cargo'
import Live, { LastTrackStateEnum } from 'models/Live'
import { NextApiResponse } from 'next'
import { CargoDetail, CargoStatus, CargoStep } from 'types'
import sdk from 'lib/twSdk'
import User from 'models/User'
import { coinTokenAddress } from 'contracts/address'

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

    if (lastTrackState === LastTrackStateEnum.On_Blocks) {
      const updatedLive = await Live.findOneAndUpdate(
        { _id: live._id, 'track.name': lastTrackState },
        {
          $set: {
            'track.$[element].value': new Date()
          }
        },
        {
          arrayFilters: [{ 'element.name': lastTrackState }],
          new: true
        }
      )

      const score = validateFullFlight(updatedLive.track)
      if (score) {
        const cargo = await Cargo.findById<ICargo>(live.cargoId)
        const user = await User.findOne({ _id: req.id })
        if (!cargo || !user) {
          throw new Error('Missing cargo or user after finish flight')
        }

        if (!cargo.isRewarded && cargo.status === CargoStatus.STARTED) {
          const remote = cargo.remote ? 3 : 1
          const prize = (cargo.prize / remote) * (1 + score / 100)
          await sdk.wallet.transfer(user.address, prize, coinTokenAddress)
          await Promise.all([
            Cargo.findByIdAndUpdate<ICargo>(live.cargoId, {
              isRewarded: true,
              status: CargoStatus.COMPLETED,
              score,
              rewards: prize
            }),
            Live.findOneAndDelete({ userId: req.id })
          ])
        }
      } else {
        // Flight is finished incomplete
      }

      res.status(200).end()
      return
    } else if (live.track.some((step: CargoDetail) => step.name === lastTrackState)) {
      await Live.findOneAndUpdate(
        { _id: live._id, 'track.name': lastTrackState },
        {
          $set: {
            'track.$[element].value': new Date()
          }
        },
        {
          arrayFilters: [{ 'element.name': lastTrackState }],
          new: true
        }
      )

      res.status(202).end
      return
    }

    // const updated = await Live.findOneAndUpdate(
    //   { userId: req.id },
    //   { status: lastTrackState, $addToSet: { track: { name: lastTrackState, value: new Date() } } },
    //   { new: true }
    // )
    // res.status(201).send(updated)
    // return
  } catch (error) {
    console.error('Live state update error =>', error)
    res.status(500).end()
  }
}

export default withAuth(handler)
