import withAuth from 'lib/withAuth'
import Atcs from 'models/Atcs'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }
  try {
    const result = await Atcs.aggregate([
      {
        $group: {
          _id: '$callsign', // Group by the callsign field
          count: { $sum: 1 } // Count the number of documents in each group
        }
      }
    ])
    res.status(200).send(result)
    return
  } catch (error) {
    console.error('error =>', error)
    res.status(500).end()
    return
  }
}

export default withAuth(handler)
