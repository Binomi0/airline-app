import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { setCookie } from 'cookies-next'
import withAuth from 'lib/withAuth'
import User from 'models/User'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }

  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      throw new Error(`Missing user ${user.email}`)
    }

    const token = jwt.sign({ data: { email: req.body.email, id: user?.id } }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })
    setCookie('token', token, { req, res })
    res.status(200).end()
    return
  } catch (err) {
    const error = err as Error
    console.error(err)
    res.status(400).send(error)
  }
}
export default withAuth(handler)
