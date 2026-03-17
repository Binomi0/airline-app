import { NextApiRequest, NextApiResponse } from 'next'
import { verifySignature } from 'utils'
import jwt from 'jsonwebtoken'
import { setCookie } from 'cookies-next'
import { connectDB } from 'lib/mongoose'
import Webauthn from 'models/Webauthn'
import User from 'models/User'
import { jwtSecret } from 'config'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req

  if (!body.data.response.signature) {
    res.status(500).end()
    return
  }

  await connectDB()
  const auth = await Webauthn.findOne({ email: req.body.email })

  if (!auth) {
    throw new Error(`Could not find authenticator ${body.data.id} for auth ${auth?._id}`)
  }

  let verified = false

  try {
    for (const authenticator of auth.authenticators) {
      const result = await verifySignature(authenticator, body.data, auth.challenge)
      if (result) {
        verified = true
        break
      }
    }
  } catch (err) {
    console.error('Login verification error:', err)
    return res.status(400).json({ error: 'Verification failed', verified: false })
  }

  if (!verified) {
    console.warn(`Invalid verification attempt for email: ${req.body.email}`)
    return res.status(401).json({ verified: false, error: 'Invalid credentials' })
  }

  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const token = jwt.sign({ data: { email: req.body.email, id: user.id } }, jwtSecret as string, {
      expiresIn: '1d'
    })

    setCookie('token', token, {
      req,
      res,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    })

    // Companion cookie to let the frontend know a session exists
    setCookie('isLoggedIn', 'true', {
      req,
      res,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/'
    })

    // Return token in body to allow frontend to pass it to Electron app
    return res.status(200).json({ verified: true, id: user.id, emailVerified: user.emailVerified, token })
  } catch (err) {
    console.error('login-response error =>', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export default handler
