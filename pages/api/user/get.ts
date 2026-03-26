import { NextApiResponse } from 'next'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import User from 'models/User'
import VirtualAirline from 'models/VirtualAirline'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  try {
    const user = await User.findOne({ email: req.user }, { projection: { _id: 0 } })

    if (!user) {
      return res.status(204).end()
    }

    const data = {
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

    return res.status(200).send(data)
  } catch (err) {
    console.log('Ha ocurrido un error', err)
    return res.status(500).send(err)
  }
}
export default withAuth(handler)
