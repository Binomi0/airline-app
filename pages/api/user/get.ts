import { NextApiResponse } from 'next'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import User from 'models/User'
import VirtualAirline from 'models/VirtualAirline'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const user = await User.findOne({ email: req.user }, { projection: { _id: 0 } })

      console.log(user)
      if (!user) {
        res.status(204).end()
        return
      }

      let data = {
        id: user.id,
        address: user.address,
        email: user.email,
        userId: user.userId,
        role: user.role,
        vaUser: null
      }

      if (user.vaUser) {
        data.vaUser = (await VirtualAirline.findById(user.vaUser)) ?? null
      }

      res.status(200).send(data)
      return
    } catch (err) {
      console.log('Ha ocurrido un error', err)
      res.status(500).send(err)
      return
    }
  }
  res.status(405).end()
}
export default withAuth(handler)
