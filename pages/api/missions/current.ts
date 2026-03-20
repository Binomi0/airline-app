import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import MissionModel from 'models/Mission'
import { MissionStatus } from 'types'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  try {
    const activeMission = await MissionModel.findOne({
      userId: req.id,
      status: MissionStatus.STARTED
    }).lean()

    if (!activeMission) {
      return res.status(204).end()
    }

    res.status(200).json(activeMission)
  } catch (error) {
    console.error('Fetch Active Mission ERROR =>', error)
    res.status(500).end()
  }
}

export default withAuth(handler)
