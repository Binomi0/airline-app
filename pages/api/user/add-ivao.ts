import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import User from 'models/User'
import VirtualAirline from 'models/VirtualAirline'
import { NextApiResponse } from 'next'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (!req.body.vaUser || !req.body.vaUser.type || !req.body.vaUser.pilotId) {
      res.status(400).end()
      return
    }

    try {
      const { vaUser } = req.body
      await VirtualAirline.create({ type: vaUser.type, pilotId: vaUser.pilotId, _id: req.id })
      const user = await User.findOneAndUpdate({ email: req.user }, { vaUser: req.id }, { new: true })

      res.status(200).send(user)
    } catch (err) {
      res.status(500).send(err)
      return
    }
  }

  res.status(405).end()
}

export default withAuth(handler)
