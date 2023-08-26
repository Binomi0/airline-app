import { getCookie } from 'cookies-next'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'

export interface CustomNextApiRequest extends NextApiRequest {
  user?: string
}

const withAuth = (handler: NextApiHandler) => async (req: CustomNextApiRequest, res: NextApiResponse) => {
  try {
    const token = getCookie('token', { req, res })
    if (token) {
      const decoded = jwt.verify(token as string, process.env.JWT_SECRET) as JwtPayload
      if (decoded.data.email) {
        req.user = decoded.data.email
        return handler(req, res)
      }
    }
  } catch (err) {
    console.error('Error', err)
  }
  res.status(401).end()
}

export default withAuth

// export default function withAuth(handler) {
//   return async (req, res) => {
//     const token = req.headers.authorization?.split(' ')[1]

//     if (!token) {
//       return res.status(401).json({ message: 'Unauthorized' })
//     }

//     try {
//       const decoded = jwt.verify(token, 'your-secret-key') // Replace with your actual secret key
//       req.user = decoded
//       return handler(req, res)
//     } catch (error) {
//       return res.status(401).json({ message: 'Unauthorized' })
//     }
//   }
// }
