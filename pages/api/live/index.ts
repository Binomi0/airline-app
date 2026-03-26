import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Live from 'models/Live'
import { NextApiResponse } from 'next'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const live = await Live.findOne({ userId: req.id, isCompleted: false })
      if (!live) {
        return res.status(204).end()
      }

      return res.status(200).send(live)
    } catch (error) {
      console.error('get Live ERROR =>', error)
      return res.status(500).send(error)
    }
  } else if (req.method === 'DELETE') {
    try {
      await Live.findOneAndDelete({ userId: req.id })

      return res.status(202).end()
    } catch (error) {
      console.error('get Live ERROR =>', error)

      return res.status(500).end()
    }
  }

  return res.status(405).end()
}

export default withAuth(handler)
