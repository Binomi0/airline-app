import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Mission from 'models/Mission'
import { NextApiResponse } from 'next'
import { MissionStatus } from 'types'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const count = await Mission.countDocuments({ userId: req.id, status: MissionStatus.COMPLETED })
      res.status(200).json({ count })
    } catch (error) {
      console.error('Mission count ERROR =>', error)
      res.status(500).end()
    }
    return
  }

  res.status(405).end()
}

export default withAuth(handler)
