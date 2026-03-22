import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import MissionModel from 'models/Mission'
import { MissionStatus, PublicMissionStatus } from 'types'
import PublicMission from 'models/PublicMission'
import { getCallsign } from 'utils'

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
        status: PublicMissionStatus.RESERVED,
        reservedBy: req.id
      }).lean()

      if (!reserverdMission) {
        return res.status(204).end()
      }

      // Add fallback callsign for legacy data
      if (!reserverdMission.callsign) {
        reserverdMission.callsign = getCallsign()
      }

      return res.status(200).json(reserverdMission)
    }

    // Add fallback callsign for legacy data
    if (!activeMission.callsign) {
      activeMission.callsign = getCallsign()
    }

    res.status(200).json(activeMission)
  } catch (error) {
    console.error('Fetch Active Mission ERROR =>', error)
    res.status(500).end()
  }
}

export default withAuth(handler)
