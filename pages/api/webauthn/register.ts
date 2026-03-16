import { NextApiRequest, NextApiResponse } from 'next'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { Authenticator } from 'types'
import { setCookie } from 'cookies-next'
import jwt from 'jsonwebtoken'
import { connectDB } from 'lib/mongoose'
import Webauthn from 'models/Webauthn'
import { jwtSecret } from 'config'

const rpID = process.env.NEXT_PUBLIC_DOMAIN
const origin = process.env.ORIGIN

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  await connectDB()
  const { email, data } = req.body

  if (!email || !data) {
    return res.status(400).json({ error: 'Missing email or registration data' })
  }

  const user = await Webauthn.findOne({ email })
  if (!user) {
    return res.status(404).json({ error: 'Registration session not found' })
  }

  let verification
  try {
    verification = await verifyRegistrationResponse({
      response: data,
      expectedChallenge: user.challenge,
      expectedOrigin: origin as string,
      expectedRPID: rpID as string
    })
  } catch (err) {
    console.error('WebAuthn Verification Error:', err)
    return res.status(400).json({ error: 'Registration verification failed' })
  }

  const { verified, registrationInfo } = verification
  if (!verified || !registrationInfo) {
    return res.status(403).json({ error: 'Verification failed' })
  }

  const { credential } = registrationInfo

  const newAuthenticator: Authenticator = {
    credentialID: credential.id,
    credentialPublicKey: Buffer.from(credential.publicKey).toString('base64'),
    counter: credential.counter,
    transports: data.response.transports
  }

  try {
    // Atomic update for both key and authenticators
    await Webauthn.findOneAndUpdate(
      { email },
      {
        $set: { key: newAuthenticator.credentialID },
        $push: { authenticators: newAuthenticator }
      }
    )
  } catch (error) {
    console.error('Database Update Error:', error)
    return res.status(500).json({ error: 'Internal server error during registration' })
  }

  const token = jwt.sign({ data: { email } }, jwtSecret as string, { expiresIn: '1d' })

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

  res.status(200).json({ success: true })
}

export default handler
