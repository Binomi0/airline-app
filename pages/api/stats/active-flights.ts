import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Live, { ILive } from 'models/Live'
import User from 'models/User'
import VirtualAirline from 'models/VirtualAirline'
import Mission from 'models/Mission'
import { NextApiResponse } from 'next'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  try {
    const activeFlights: ILive[] = await Live.find({ isCompleted: false })
      .populate({
        path: 'userId',
        model: User,
        populate: {
          path: 'vaUser',
          model: VirtualAirline,
          select: 'pilotId'
        }
      })
      .populate({
        path: 'missionId',
        model: Mission,
        select: 'origin destination distance aircraftId callsign'
      })
      .sort({ updatedAt: -1 })
      .limit(20)
      .lean()

    res.status(200).json(activeFlights)
  } catch (error) {
    console.error('Fetch Active Flights ERROR =>', error)
    res.status(500).end()
  }
}

export default withAuth(handler)
