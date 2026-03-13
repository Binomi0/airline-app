import { connectDB } from 'lib/mongoose'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      await connectDB()
    } catch (error) {
      return res.status(500).send(error)
    }
  } else if (req.method === 'DELETE') {
  }

  res.status(405).end()
}

export default withAuth(handler)
