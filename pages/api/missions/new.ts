import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Mission from 'models/Mission'
import { NextApiResponse } from 'next'
import { MissionStatus } from 'types'
import { PublicMissionStatus } from 'types'
import PublicMissionModel from 'models/PublicMission'
import { ObjectId } from 'mongodb'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const missionData = req.body

    try {
      // 0. Single-Reservation Check: User can only have one active mission or reservation
      const [current, hasPoolReservation] = await Promise.all([
        Mission.findOne({ userId: req.id, status: MissionStatus.STARTED }),
        PublicMissionModel.exists({
          reservedBy: new ObjectId(req.id as string),
          status: { $in: [PublicMissionStatus.RESERVED, PublicMissionStatus.ACTIVE] }
        })
      ])

      if (current || hasPoolReservation) {
        res.status(202).send(current || { error: 'You already have an active reservation in the pool' })
        return
      }

      const newMission = await Mission.create({
        ...missionData,
        userId: req.id,
        status: MissionStatus.STARTED
      })

      res.status(201).send(newMission)
      return
    } catch (error) {
      console.error('New Mission ERROR =>', error)
      res.status(500).end()
      return
    }
  }

  res.status(405).end()
}

export default withAuth(handler)
