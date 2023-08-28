import { connectDB } from 'lib/mongoose'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Live from 'models/Live'
import { NextApiResponse } from 'next'
import { LastTrackState } from 'types'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  } else if (!req.body.state) {
    res.status(400).end()
    return
  }

  const lastTrackState = req.body.state as LastTrackState

  console.log({ lastTrackState })
  try {
    await connectDB()
    const live = await Live.findOneAndUpdate(
      { userId: req.id },
      {
        status: lastTrackState,
        $addToSet: { track: { name: lastTrackState, value: new Date() } }
      }
    )
    console.log({ live })
    res.status(201).send(live)
    return
  } catch (error) {
    console.error('Live state update error =>', error)
    res.status(500).end()
  }
}

export default withAuth(handler)
