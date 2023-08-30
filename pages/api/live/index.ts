import { connectDB } from 'lib/mongoose'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Live from 'models/Live'
import { NextApiResponse } from 'next'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      await connectDB()
      const live = await Live.findOne({ userId: req.id })
      if (!live) {
        res.status(204).end()
        return
      }

      res.status(200).send(live)
      return
    } catch (error) {
      console.error('get Live ERROR =>', error)
      res.status(500).end()
      return
    }
  } else if (req.method === 'DELETE') {
    try {
      await connectDB()
      await Live.findOneAndRemove({ userId: req.id })

      res.status(202).end()
      return
    } catch (error) {
      console.error('get Live ERROR =>', error)
      res.status(500).end()
      return
    }
  }

  res.status(405).end()
}

export default withAuth(handler)
