import { setCookie } from 'cookies-next'
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

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]

    if (token && typeof token === 'string') {
      try {
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload
        if (decoded.data?.email) {
          // Sync isLoggedIn hint cookie if missing
          if (!req.cookies.isLoggedIn) {
            setCookie('isLoggedIn', 'true', {
              req,
              res,
              httpOnly: false,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 60 * 60 * 24,
              path: '/'
            })
          }

          const user = await User.findOne({ email: decoded.data.email })
          if (user?._id) {
            req.user = decoded.data.email
            req.id = user._id
            req.userId = user.id
            return handler(req, res)
          } else {
            console.warn(`[withAuth] User not found in database for email: ${decoded.data.email}`)
          }
        }
      } catch (err) {
        console.error('[withAuth] JWT Verification Failed:', (err as Error).message)
      }
    }
  } catch (err) {
    console.error('[withAuth] Unexpected Error:', (err as Error).message)
  }

  res.status(401).end()
}

export default withAuth
