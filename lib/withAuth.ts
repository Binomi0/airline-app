import { getCookie } from 'cookies-next'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { connectDB } from './mongoose'
import User from 'models/User'

const getUser = async (email: string) => {
  const user = await User.findOne({ email }, { _id: 1, id: 1 })
  if (!user) {
    throw new Error('[cookieToken] Missing _id in user?')
  }

  if (!user?._id) {
    throw new Error('[cookieToken] Missing _id in user?')
  }

  return user
}

const verifyToken = async (
  headerToken: string,
  handler: NextApiHandler,
  req: CustomNextApiRequest,
  res: NextApiResponse
) => {
  const decoded = jwt.verify(headerToken, process.env.JWT_SECRET) as JwtPayload
  if (decoded.data.email) {
    const user = await getUser(decoded.data.email)
    req.user = decoded.data.email
    req.id = user._id
    req.userId = user.id

    return handler(req, res)
  }
}

export interface CustomNextApiRequest extends NextApiRequest {
  user?: string
  id?: string
  userId?: string
  headers: NextApiRequest['headers'] & { 'x-ivao-auth'?: string }
}
const withAuth = (handler: NextApiHandler) => async (req: CustomNextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB()

    const cookieToken = getCookie('token', { req, res })
    if (cookieToken) {
      return verifyToken(cookieToken as string, handler, req, res)
    } else {
      const headerToken = req.headers.authorization?.split(' ')[1]
      if (headerToken) {
        return verifyToken(headerToken as string, handler, req, res)
      }
    }
  } catch (err) {
    console.error('Error', err)
  }
  res.status(401).end()
}

export default withAuth
