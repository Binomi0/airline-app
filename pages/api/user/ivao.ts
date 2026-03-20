import { connectDB } from 'lib/mongoose'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { VirtualAirlineModel } from 'models'
import { NextApiResponse } from 'next'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      await connectDB()

      const user = await VirtualAirlineModel.findOne({ userId: req.userId })
      if (!user) {
        res.status(404).end()
        return
      }
      res.status(200).send(user)
      return
    } catch (err) {
      console.error(err)

      res.status(400).send(err)
      return
    }
  }
  res.status(405).end()
}

export default withAuth(handler)
