import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import MissionModel from 'models/Mission'
import { MissionStatus, PublicMissionStatus } from 'types'
import PublicMission from 'models/PublicMission'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  try {
    const activeMission = await MissionModel.findOne({
      userId: req.id,
      status: { $in: [MissionStatus.STARTED, MissionStatus.RESERVED] }
    }).lean()

    if (!activeMission) {
      const reserverdMission = await PublicMission.findOne({
        status: PublicMissionStatus.RESERVED
        // reservedBy: req.id
      }).lean()
      console.log('RESERVED MISSION =>', reserverdMission)
      if (!reserverdMission) {
        return res.status(204).end()
      }

      return res.status(200).json(reserverdMission)
    }

    res.status(200).json(activeMission)
  } catch (error) {
    console.error('Fetch Active Mission ERROR =>', error)
    res.status(500).end()
  }
}

export default withAuth(handler)
