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
    const cookieToken = getCookie('token', { req, res })

    if (cookieToken) {
      const decoded = jwt.verify(cookieToken as string, process.env.JWT_SECRET) as JwtPayload
      if (decoded.data.email) {
        await connectDB()
        const user = await User.findOne({ email: decoded.data.email }, { _id: 1 })
        req.user = decoded.data.email
        req.id = user._id
        return handler(req, res)
      }
    }
    const headerToken = req.headers.authorization?.split(' ')[1]
    if (headerToken) {
      const decoded = jwt.verify(headerToken as string, process.env.JWT_SECRET) as JwtPayload
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
