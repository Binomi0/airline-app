import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import PublicMissionModel from 'models/PublicMission'
import { generatePublicMissionPool } from 'lib/mission-generator'
import { PublicMissionStatus } from 'types'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  try {
    // 1. Trigger pool replenishment if low (non-blocking)
    const currentCount = await PublicMissionModel.countDocuments({ status: PublicMissionStatus.AVAILABLE })
    if (currentCount < 30) {
      generatePublicMissionPool().catch(err => console.error('[MissionPool] Replenishment error:', err))
    }

    // 2. Fetch available missions
    const missions = await PublicMissionModel.find({ 
      status: PublicMissionStatus.AVAILABLE,
      endTime: { $gt: new Date() } // Ensure they haven't ended
    }).sort({ distance: 1 }).lean()

    res.status(200).json(missions)
  } catch (error) {
    console.error('Fetch Missions ERROR =>', error)
    res.status(500).end()
  }
}

export default withAuth(handler)
