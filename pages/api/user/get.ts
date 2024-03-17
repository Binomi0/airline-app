import { NextApiResponse } from 'next'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import User from 'models/User'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const user = await User.findOne({ email: req.user }, { projection: { _id: 0 } })

      if (!user) {
        res.status(204).end()
        return
      }

      res
        .status(200)
        .send({ id: user.id, address: user.address, email: user.email, userId: user.userId, role: user.role })
      return
    } catch (err) {
      res.status(500).send(err)
      return
    }
  }
  res.status(405).end()
}
export default withAuth(handler)
