import { connectDB } from 'lib/mongoose'
import Webauthn from 'models/Webauthn'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (!req.body.email) {
      res.status(400).end()
      return
    }
    try {
      await connectDB()
      const user = await Webauthn.findOne({ email: req.body.email })

      if (!user || !user.authenticators.length) {
        res.status(200).send({ success: false })
        return
      }

      res.status(200).send({ success: true })
      return
    } catch (err) {
      res.status(500).send(err)
      return
    }
  }

  res.status(405).end()
}
export default handler
