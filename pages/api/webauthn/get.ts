import { connectDB } from 'lib/mongoose'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Webauthn from 'models/Webauthn'
import { NextApiResponse } from 'next'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      await connectDB()
      const webauthn = await Webauthn.findOne({ email: req.user })

      if (!webauthn || !webauthn.authenticators.length) {
        res.status(204).end()
        return
      }

      res.status(200).send(webauthn)
      return
    } catch (err) {
      res.status(500).send(err)
      return
    }
  }

  res.status(405).end()
}
export default withAuth(handler)
