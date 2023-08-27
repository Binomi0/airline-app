import { NextApiResponse } from 'next'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { connectDB } from 'lib/mongoose'
import User from 'models/User'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      await connectDB()
      const user = await User.findOne({ email: req.user }, { projection: { _id: 0 } })

      console.log('get user', user)
      if (!user) {
        res.status(404).end()
        return
      }

      res.status(200).send({ success: true, user })
      return
    } catch (err) {
      res.status(500).send(err)
      return
    }
  }
  res.status(405).end()
}
export default withAuth(handler)
