import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import PublicMissionModel from 'models/PublicMission'
import MissionModel from 'models/Mission'
import { PublicMissionStatus, MissionStatus } from 'types'
import { ObjectId } from 'mongodb'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  try {
    const startedAt = new Date()
    // Extend expiration to ensure no TTL deletion during flight (e.g., +8 hours)
    const extendedExpiration = new Date(startedAt.getTime() + 8 * 3600000)

    // 1. Update the Pool record
    const publicMission = await PublicMissionModel.findOneAndUpdate(
      {
        reservedBy: new ObjectId(req.id as string),
        status: PublicMissionStatus.RESERVED
      },
      {
        $set: {
          status: PublicMissionStatus.ACTIVE,
          startedAt,
          expiresAt: extendedExpiration
        }
      },
      { returnDocument: 'after' }
    ).lean()

    // 2. Update the User's Mission record
    const userMission = await MissionModel.findOneAndUpdate(
      {
        userId: new ObjectId(req.id as string),
        status: MissionStatus.RESERVED
      },
      {
        $set: {
          status: MissionStatus.STARTED,
          startedAt,
          expiresAt: extendedExpiration
        }
      },
      { returnDocument: 'after' }
    ).lean()

    if (!publicMission && !userMission) {
      return res.status(404).json({ error: 'No reserved mission found to activate' })
    }

    res.status(200).json({
      message: 'Mission activated successfully',
      startedAt,
      expiresAt: extendedExpiration
    })
  } catch (error) {
    console.error('Activate Mission ERROR =>', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default withAuth(handler)
