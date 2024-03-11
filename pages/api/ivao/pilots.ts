import withAuth from 'lib/withAuth'
import { NextApiRequest, NextApiResponse } from 'next'
import { PilotModel } from 'models'
import { Pilot } from 'models/Pilot'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }

  try {
    const pilots = await PilotModel.find<Pilot>({})

    res.status(200).send(pilots)
  } catch (err) {
    res.status(500).send({error: err, message: 'White searching for pilots'})
  }
}

export default withAuth(handler)
