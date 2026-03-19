import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import { generateMissionsForUser } from 'lib/mission-generator'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const { aircraftId, origin } = req.query
  console.log('Missions API - Requesting missions for:', { origin, aircraftId })

  try {
    const missions = await generateMissionsForUser(req.id as string, aircraftId as string, origin as string)
    res.status(200).json(missions)
  } catch (error) {
    console.error('Fetch Missions ERROR =>', error)
    res.status(500).end()
  }
}

export default withAuth(handler)
