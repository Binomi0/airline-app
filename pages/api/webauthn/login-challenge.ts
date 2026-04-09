import { NextApiRequest, NextApiResponse } from 'next'
import { verifySignature } from 'utils'
import jwt from 'jsonwebtoken'
import { setCookie } from 'cookies-next'
import { connectDB } from 'lib/mongoose'
import Webauthn from 'models/Webauthn'
import User from 'models/User'
import { jwtSecret } from 'config'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  const { data, email } = req.body

  if (!data.response.signature) {
    res.status(400).send('Signature not found')
    return
  }

  await connectDB()
  const auth = await Webauthn.findOne({ email }, { authenticators: 1, challenge: 1 })

  if (!auth) {
    throw new Error(`Could not find authenticator ${data.id} for auth ${auth?._id}`)
  }

  let verified = false
  let prfResult

  try {
    for (const authenticator of auth.authenticators) {
      const { extensionResult, verification } = await verifySignature(authenticator, data, auth.challenge)
      if (verification?.verified) {
        verified = true
        prfResult = extensionResult?.prf?.results?.first
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
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const token = jwt.sign({ data: { email, id: user.id } }, jwtSecret as string, {
      expiresIn: '1d'
    })

    setCookie('token', token, {
      req,
      res,
      httpOnly: true,
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

    res.status(200).json({
      verified: true,
      id: user.id,
      emailVerified: user.emailVerified,
      prfResult: prfResult?.results?.first
    })
  } catch (err) {
    console.error('login-response error =>', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export default handler
