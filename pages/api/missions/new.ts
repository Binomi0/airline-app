import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Mission from 'models/Mission'
import { NextApiResponse } from 'next'
import { MissionStatus } from 'types'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const missionData = req.body

    try {
      const current = await Mission.findOne({ userId: req.id, status: MissionStatus.STARTED })

      if (current) {
        res.status(202).send(current)
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
