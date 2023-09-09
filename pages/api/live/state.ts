import { connectDB } from 'lib/mongoose'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Live from 'models/Live'
import { NextApiResponse } from 'next'
import { CargoDetail, LastTrackStateEnum } from 'types'

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

    // If exists, to avoid duplicates
    if (live.track.some((step: CargoDetail) => step.name === lastTrackState)) {
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

      res.status(202).end()
      return
    }

    const updated = await Live.findOneAndUpdate(
      { userId: req.id },
      {
        status: lastTrackState,
        $addToSet: { track: { name: lastTrackState, value: new Date() } },
        isCompleted: lastTrackState === LastTrackStateEnum.On_Blocks
      },
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
