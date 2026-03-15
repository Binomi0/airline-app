import { getCookie } from 'cookies-next'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { connectDB } from './mongoose'
import User from 'models/User'
import { jwtSecret } from 'config'

export interface CustomNextApiRequest extends NextApiRequest {
  user?: string
  id?: string
  userId?: string
  headers: NextApiRequest['headers'] & { 'x-ivao-auth'?: string }
}

const withAuth = (handler: NextApiHandler) => async (req: CustomNextApiRequest, res: NextApiResponse) => {
  try {
    if (!jwtSecret) {
      console.error('JWT_SECRET is not configured')
      return res.status(500).end()
    }

    await connectDB()

    const cookieToken = getCookie('token', { req, res })
    const headerToken = req.headers.authorization?.split(' ')[1]
    const token = (cookieToken || headerToken) as string

    if (token) {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload
      if (decoded.data?.email) {
        const user = await User.findOne({ email: decoded.data.email }, { _id: 1, id: 1 })
        if (user?._id) {
          req.user = decoded.data.email
          req.id = user._id
          req.userId = user.id
          return handler(req, res)
        }
      }
    }
  } catch (err) {
    console.error('Authentication Error:', (err as Error).message)
  }
  
  res.status(401).end()
}

export default withAuth
