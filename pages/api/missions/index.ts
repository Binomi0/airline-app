import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import PublicMissionModel from 'models/PublicMission'
import MissionModel from 'models/Mission'
import LiveModel from 'models/Live'
import { generatePublicMissionPool } from 'lib/mission-generator'
import { PublicMissionStatus, MissionStatus } from 'types'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      // 1. Lazy Cleanup: Revert expired reservations (20 min timeout)
      const reservationTimeout = new Date(Date.now() - 20 * 60 * 1000)
      await PublicMissionModel.updateMany(
        {
          status: PublicMissionStatus.RESERVED,
          reservedAt: { $lt: reservationTimeout }
        },
        {
          $set: {
            status: PublicMissionStatus.AVAILABLE,
            reservedBy: null,
            reservedAt: null
          }
        }
      )

      // 2. Trigger pool replenishment if low (non-blocking)
      const currentCount = await PublicMissionModel.countDocuments({ status: PublicMissionStatus.AVAILABLE })
      if (currentCount < 30) {
        generatePublicMissionPool().catch((err) => console.error('[MissionPool] Replenishment error:', err))
      }

      // 3. Handle targeted origin request
      if (req.query.origin) {
        const origin = (req.query.origin as string).toUpperCase()
        const isIcaoCode = (code: string) => /^[A-Z0-9]{3,4}$/.test(code) // Standardized validation

        if (isIcaoCode(origin)) {
          // Check if we have enough missions for this origin
          const originCount = await PublicMissionModel.countDocuments({
            origin,
            status: PublicMissionStatus.AVAILABLE,
            endTime: { $gt: new Date() }
          })

          if (originCount === 0) {
            await generatePublicMissionPool(origin)
          }

          const missions = await PublicMissionModel.find({
            origin,
            status: PublicMissionStatus.AVAILABLE,
            endTime: { $gt: new Date() }
          })
            .sort({ distance: 1 })
            .lean()

          return res.status(200).json(missions)
        }
      }

      // 4. Default: Fetch all available missions
      const missions = await PublicMissionModel.find({
        status: PublicMissionStatus.AVAILABLE,
        endTime: { $gt: new Date() }
      })
        .sort({ distance: 1 })
        .lean()

      res.status(200).json(missions)
    } catch (error) {
      console.error('Fetch Missions ERROR =>', error)
      res.status(500).end()
    }
  } else if (req.method === 'DELETE') {
    try {
      const userId = req.id!

      // 1. Release Public Mission
      await PublicMissionModel.findOneAndUpdate(
        { reservedBy: userId, status: { $in: [PublicMissionStatus.RESERVED, PublicMissionStatus.ACTIVE] } },
        {
          $set: {
            status: PublicMissionStatus.AVAILABLE,
            reservedBy: null,
            reservedAt: null
          }
        }
      )

      // 2. Clear Personal Mission Records
      await MissionModel.deleteMany({
        userId,
        status: { $in: [MissionStatus.RESERVED, MissionStatus.STARTED] }
      })

      // 3. Clear Live session record
      await LiveModel.findOneAndDelete({ userId })

      res.status(200).json({ message: 'Mission cancelled successfully' })
    } catch (error) {
      console.error('Cancel Mission ERROR =>', error)
      res.status(500).json({ error: 'Failed to cancel mission' })
    }
  } else {
    res.status(405).end()
  }
}

export default withAuth(handler)
