import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Mission from 'models/Mission'
import User from 'models/User'
import VirtualAirline from 'models/VirtualAirline'
import { NextApiResponse } from 'next'
import { MissionStatus } from 'types'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  try {
    // 1. Top 10 Effective (Rewards)
    const effective = await Mission.aggregate([
      { $match: { status: MissionStatus.COMPLETED, rewards: { $gt: 0 } } },
      { $group: { _id: '$userId', value: { $sum: '$rewards' }, count: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $limit: 10 }
    ])

    // 2. Top 10 Traveled (Distance)
    const traveled = await Mission.aggregate([
      { $match: { status: MissionStatus.COMPLETED, distance: { $gt: 0 } } },
      { $group: { _id: '$userId', value: { $sum: '$distance' } } },
      { $sort: { value: -1 } },
      { $limit: 10 }
    ])

    // 3. Top 10 Fastest (Average Speed)
    const fastest = await Mission.aggregate([
      { 
        $match: { 
          status: MissionStatus.COMPLETED, 
          startedAt: { $ne: null }, 
          distance: { $gt: 0 } 
        } 
      },
      {
        $project: {
          userId: 1,
          durationMs: { $subtract: ['$updatedAt', '$startedAt'] },
          distance: 1
        }
      },
      { $match: { durationMs: { $gt: 60000 } } }, // At least 1 minute flight
      {
        $project: {
          userId: 1,
          speed: { $divide: [{ $multiply: ['$distance', 3600000] }, '$durationMs'] }
        }
      },
      { $group: { _id: '$userId', value: { $avg: '$speed' } } },
      { $sort: { value: -1 } },
      { $limit: 10 }
    ])

    // 4. Top 10 High Score (Average Score)
    const topScorers = await Mission.aggregate([
      { $match: { status: MissionStatus.COMPLETED, score: { $gt: 0 } } },
      { $group: { _id: '$userId', value: { $avg: '$score' } } },
      { $sort: { value: -1 } },
      { $limit: 10 }
    ])

    interface RankingData {
      _id: string
      value: number
    }

    interface LeanUser {
      id: string
      vaUser?: {
        pilotId: string
      }
    }

    // Enrich with Pilot ID
    const enrich = async (rankings: RankingData[]) => {
      return Promise.all(
        rankings.map(async (r) => {
          const user = (await User.findById(r._id)
            .populate({
              path: 'vaUser',
              model: VirtualAirline,
              select: 'pilotId'
            })
            .lean()) as unknown as LeanUser
          return {
            ...r,
            pilotId: user?.vaUser?.pilotId || user?.id || 'Pilot'
          }
        })
      )
    }

    res.status(200).json({
      effective: await enrich(effective),
      traveled: await enrich(traveled),
      fastest: await enrich(fastest),
      topScorers: await enrich(topScorers)
    })
  } catch (error) {
    console.error('Fetch Rankings ERROR =>', error)
    res.status(500).end()
  }
}

export default withAuth(handler)
