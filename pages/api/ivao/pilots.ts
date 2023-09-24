import withAuth from 'lib/withAuth'
import { connectDB, mongoose } from 'lib/mongoose'
import { NextApiRequest, NextApiResponse } from 'next'
import { PilotModel } from 'models'
import { Pilot } from 'models/Pilot'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }

  try {
    await connectDB()
    const pilots = await PilotModel.find<Pilot>({})

    res.status(200).send(pilots)
  } catch (err) {
    res.status(500).send(err)
  } finally {
    // await mongoose.disconnect()
  }
}

export default withAuth(handler)
