import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import MissionModel from 'models/Mission'
import NftModel from 'models/Nft'
import LiveModel from 'models/Live'
import { MissionStatus, PublicMissionStatus, aircraftNameToIcaoCode } from 'types'
import { getEstimatedTimeMinutes, getMissionWeight } from 'utils'
import { INft } from 'models/Nft'
import moment from 'moment'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { eventData, aircraftId } = req.body

  if (!eventData || !aircraftId) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // 0. Single-Reservation Check
    const hasActiveMission = await MissionModel.exists({
      userId: req.id,
      status: { $in: [MissionStatus.STARTED, MissionStatus.RESERVED] }
    })

    if (hasActiveMission) {
      return res.status(400).json({ error: 'Ya tienes una misión activa o una reserva pendiente.' })
    }

    // 1. Fetch aircraft details
    const aircraftNft = await NftModel.findOne({ id: BigInt(aircraftId) }).lean()
    if (!aircraftNft) {
      return res.status(404).json({ error: 'Aircraft not found' })
    }
    const cruiseSpeedIcao =
      aircraftNameToIcaoCode[aircraftNft.metadata.name as keyof typeof aircraftNameToIcaoCode] || 'C172'

    // 2. Create the personal mission record
    // We add a safety margin to expiration based on flight start time
    const flightStartTime = moment(eventData.startTime)
    const expiresAt = flightStartTime.add(20, 'minutes').toDate()

    const userMission = await MissionModel.create({
      userId: req.id,
      origin: eventData.origin,
      destination: eventData.destination,
      distance: eventData.distance,
      type: eventData.type,
      category: eventData.category,
      isSponsored: true,
      rewardMultiplier: eventData.rewardMultiplier || 2.0,
      details: eventData.details,
      prize: eventData.prize,
      expiresAt: expiresAt,
      originCoords: eventData.originCoords,
      destinationCoords: eventData.destinationCoords,
      aircraftId,
      callsign: eventData.callsign,
      weight: getMissionWeight(aircraftNft as unknown as INft),
      status: MissionStatus.RESERVED,
      remote: false,
      isRewarded: false,
      estimatedTimeMinutes: getEstimatedTimeMinutes(eventData.distance, cruiseSpeedIcao),
      originAtcOnStart: false,
      destinationAtcOnStart: false
    })

    // 3. Create Live session record
    await LiveModel.findOneAndUpdate(
      { userId: req.id },
      {
        $set: {
          missionId: userMission._id,
          userId: req.id,
          aircraftId: userMission.aircraftId,
          callsign: userMission.callsign,
          isCompleted: false,
          track: { name: PublicMissionStatus.RESERVED, value: new Date() }
        }
      },
      { upsert: true, returnDocument: 'after' }
    )

    res.status(201).json(userMission)
  } catch (error) {
    console.error('Reserve Event Mission ERROR =>', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default withAuth(handler)
