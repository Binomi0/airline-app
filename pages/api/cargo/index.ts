import { connectDB } from 'lib/mongoose'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Live from 'models/Live'
import { NextApiResponse } from 'next'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(405).end()
  try {
    await connectDB()
    const cargo = await Live.findOne({ userId: req.id })

    return res.json(cargo)
  } catch (e) {
    console.error(e)
    return res.status(500).end('ERROR')
  }
}

export default withAuth(handler)
