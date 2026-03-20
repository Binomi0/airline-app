import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import PublicMissionModel from 'models/PublicMission'
import MissionModel from 'models/Mission'
import { PublicMissionStatus, MissionStatus } from 'types'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { missionId, aircraftId, callsign, weight } = req.body

  if (!missionId || !aircraftId || !callsign) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // 1. Atomic reservation in the public pool
    const publicMission = await PublicMissionModel.findOneAndUpdate(
      { 
        _id: missionId, 
        status: PublicMissionStatus.AVAILABLE 
      },
      { 
        $set: { 
          status: PublicMissionStatus.RESERVED,
          reservedBy: req.id,
          reservedAt: new Date()
        } 
      },
      { new: true }
    ).lean()

    if (!publicMission) {
      return res.status(409).json({ error: 'Mission already reserved or not found' })
    }

    // 2. Create the personal mission record for tracking
    const userMission = await MissionModel.create({
      userId: req.id,
      origin: publicMission.origin,
      destination: publicMission.destination,
      distance: publicMission.distance,
      type: publicMission.type,
      category: publicMission.category,
      isSponsored: publicMission.isSponsored,
      rewardMultiplier: publicMission.rewardMultiplier,
      details: publicMission.details,
      prize: publicMission.prize,
      expiresAt: publicMission.expiresAt,
      originCoords: publicMission.originCoords,
      destinationCoords: publicMission.destinationCoords,
      aircraftId,
      callsign,
      weight: weight || 1500, // Default weight if not provided
      status: MissionStatus.STARTED,
      remote: false,
      isRewarded: false
    })

    res.status(201).json(userMission)
  } catch (error) {
    console.error('Reserve Mission ERROR =>', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default withAuth(handler)
