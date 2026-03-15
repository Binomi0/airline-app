import { NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { setCookie } from 'cookies-next'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import User from 'models/User'
import { jwtSecret } from 'config'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }

  try {
    const user = await User.findOne({ email: req.user })
    if (!user) {
      throw new Error(`User not found: ${req.user}`)
    }

    const token = jwt.sign({ data: { email: req.user, id: req.id } }, jwtSecret as string, { expiresIn: '1h' })

    setCookie('token', token, {
      req,
      res,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/'
    })

    setCookie('isLoggedIn', 'true', {
      req,
      res,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/'
    })

    res.status(200).end()
    return
  } catch (err) {
    const error = err as Error
    console.error(err)
    res.status(400).send(error)
  }
}
export default withAuth(handler)
