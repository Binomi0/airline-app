import { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from 'lib/mongoose'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { deleteCookie, getCookie } from 'cookies-next'
import User from 'models/User'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB()
  try {
    const token = getCookie('token', { req, res })
    if (!token) {
      res.status(401).end()
      return
    }
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET) as JwtPayload

    if (decoded.data.email) {
      const user = await User.findOne({ email: decoded.data.email })

      res.status(200).send({ user, token })
      return
    } else {
      res.status(400).end()
      return
    }
  } catch (err) {
    const error = err as Error
    if (error?.message === 'jwt expired') {
      deleteCookie('token', { req, res })
      res.status(401).end()
      return
    }
    res.status(500).send(err)
  }
}
export default handler
