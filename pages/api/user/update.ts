import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import User from 'models/User'
import { NextApiResponse } from 'next'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (!req.body.address) {
      res.status(400).end()
      return
    }

    const { address } = req.body
    const user = await User.findOneAndUpdate({ email: req.user }, { address })

    res.status(200).send(user)
  }

  res.status(405).end()
}

export default withAuth(handler)
