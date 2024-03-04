import { connectDB } from 'lib/mongoose'
import User from 'models/User'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (!req.body.email) {
      res.status(400).end()
      return
    }
    try {
      await connectDB()

      const user = await User.findOne({ email: req.body.email }, { id: 1 })

      if (!user) {
        res.status(200).send({ success: false })
        return
      }

      res.status(200).send({ success: true, emailVerified: user.emailVerified })
      return
    } catch (err) {
      res.status(500).send(err)
      return
    }
  }

  res.status(405).end()
}
export default handler
