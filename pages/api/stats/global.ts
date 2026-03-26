import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Mission from 'models/Mission'
import { NextApiResponse } from 'next'
import { MissionStatus } from 'types'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  try {
    // 1. Global Totals
    const totals = await Mission.aggregate([
      { $match: { status: MissionStatus.COMPLETED } },
      {
        $group: {
          _id: null,
          totalMissions: { $sum: 1 },
          totalDistance: { $sum: '$distance' },
          totalRewards: { $sum: '$rewards' }
        }
      }
    ])

    // 2. Aircraft Popularity
    const aircraftPopularity = await Mission.aggregate([
      { $match: { status: MissionStatus.COMPLETED } },
      { $group: { _id: '$aircraftId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])

    // 3. Busiest Hubs (Origin & Destination combined)
    const hubs = await Mission.aggregate([
      { $match: { status: MissionStatus.COMPLETED } },
      {
        $facet: {
          origins: [{ $group: { _id: '$origin', count: { $sum: 1 } } }],
          destinations: [{ $group: { _id: '$destination', count: { $sum: 1 } } }]
        }
      },
      { $project: { all: { $concatArrays: ['$origins', '$destinations'] } } },
      { $unwind: '$all' },
      { $group: { _id: '$all._id', total: { $sum: '$all.count' } } },
      { $sort: { total: -1 } },
      { $limit: 10 }
    ])

    // 4. Mission Type Distribution
    const typeDistribution = await Mission.aggregate([
      { $match: { status: MissionStatus.COMPLETED } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    // 5. Success Rate
    const successRate = await Mission.aggregate([
      { $match: { status: { $in: [MissionStatus.COMPLETED, MissionStatus.ABORTED] } } },
      {
        $group: {
          _id: null,
          completed: { $sum: { $cond: [{ $eq: ['$status', MissionStatus.COMPLETED] }, 1, 0] } },
          total: { $sum: 1 }
        }
      }
    ])

    // 6. Average Duration
    const avgDuration = await Mission.aggregate([
      { $match: { status: MissionStatus.COMPLETED, startedAt: { $ne: null } } },
      {
        $project: {
          duration: { $divide: [{ $subtract: ['$updatedAt', '$startedAt'] }, 60000] }
        }
      },
      { $match: { duration: { $gt: 0, $lt: 1440 } } }, // Max 24h
      { $group: { _id: null, avg: { $avg: '$duration' } } }
    ])

    // 7. Recent Activity (Last 10 missions completed)
    const recentActivity = await Mission.find({ status: MissionStatus.COMPLETED })
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate('userId', 'userId email')
      .lean()

    res.status(200).json({
      totals: totals[0] || { totalMissions: 0, totalDistance: 0, totalRewards: 0 },
      aircraftPopularity,
      hubs,
      typeDistribution,
      successRate: successRate[0] || { completed: 0, total: 0 },
      avgDuration: avgDuration[0]?.avg || 0,
      recentActivity
    })
  } catch (error) {
    console.error('Fetch Global Stats ERROR =>', error)
    res.status(500).end()
  }
}

export default withAuth(handler)
