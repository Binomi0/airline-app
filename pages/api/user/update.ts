import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import User from 'models/User'
import { NextApiResponse } from 'next'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (req.body.address === undefined && req.body.onboarded === undefined) {
      res.status(400).end()
      return
    }

    const { address, onboarded } = req.body
    const updateData: any = {}
    if (address !== undefined) updateData.address = address
    if (onboarded !== undefined) updateData.onboarded = onboarded

    const user = await User.findOneAndUpdate({ email: req.user }, updateData, { new: true })

    res.status(200).send(user)
  }

  res.status(405).end()
}

export default withAuth(handler)
