import { getCookie } from 'cookies-next'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { connectDB } from './mongoose'
import User from 'models/User'

export interface CustomNextApiRequest extends NextApiRequest {
  user?: string
  id?: string
}

const withAuth = (handler: NextApiHandler) => async (req: CustomNextApiRequest, res: NextApiResponse) => {
  try {
    const token = getCookie('token', { req, res })
    if (token) {
      const decoded = jwt.verify(token as string, process.env.JWT_SECRET) as JwtPayload
      if (decoded.data.email) {
        await connectDB()
        const user = await User.findOne({ email: decoded.data.email }, { _id: 1 })
        req.user = decoded.data.email
        req.id = user._id
        return handler(req, res)
      }
    }
  } catch (err) {
    console.error('Error', err)
  }
  res.status(401).end()
}

export default withAuth
