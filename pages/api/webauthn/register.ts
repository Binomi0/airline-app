import { NextApiRequest, NextApiResponse } from 'next'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { Authenticator } from 'types'
import { setCookie } from 'cookies-next'
import jwt from 'jsonwebtoken'
import { connectDB } from 'lib/mongoose'
import Webauthn from 'models/Webauthn'
import { jwtSecret } from 'config'

const rpID = process.env.NEXT_PUBLIC_DOMAIN || 'localhost'
const origin = process.env.ORIGIN || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '')

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

  let verified = false
  let registrationInfo: any = null
  try {
    const verification = await verifyRegistrationResponse({
      response: data,
      expectedChallenge: user.challenge,
      expectedOrigin: origin as string,
      expectedRPID: rpID as string,
      requireUserVerification: false
    })
    verified = verification.verified
    registrationInfo = verification.registrationInfo
  } catch (err) {
    console.error('WebAuthn Verification Error:', err)
    res.status(400).json({ error: 'Registration verification failed' })
    return
  }

  console.log(`[register] Verification result for ${email}:`, {
    verified,
    registrationInfo: registrationInfo ? {
      credentialID: registrationInfo.credential.id,
      transports: data.response.transports
    } : null
  })

  if (!verified || !registrationInfo) {
    res.status(403).json({ error: 'Verification failed' })
    return
  }

  const { credential } = registrationInfo

  const userAgent = req.headers['user-agent'] || ''
  let deviceName = 'Unknown Device'

  if (userAgent.includes('Windows')) deviceName = 'Windows'
  else if (userAgent.includes('Android')) deviceName = 'Android'
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) deviceName = 'iOS'
  else if (userAgent.includes('Macintosh')) deviceName = 'Mac'
  else if (userAgent.includes('Linux')) deviceName = 'Linux'

  const browser =
    userAgent.includes('Chrome') && !userAgent.includes('Edg')
      ? 'Chrome'
      : userAgent.includes('Safari') && !userAgent.includes('Chrome')
        ? 'Safari'
        : userAgent.includes('Edg')
          ? 'Edge'
          : userAgent.includes('Firefox')
            ? 'Firefox'
            : ''

  if (browser) deviceName = `${deviceName} (${browser})`

  const newAuthenticator: Authenticator = {
    credentialID: credential.id,
    credentialPublicKey: Buffer.from(credential.publicKey).toString('base64'),
    counter: credential.counter,
    transports: data.response.transports,
    name: deviceName,
    createdAt: new Date()
  }

  try {
    const webauthnUser = await Webauthn.findOne({ email })

    if (webauthnUser?.authenticators.some((a: Authenticator) => a.credentialID === newAuthenticator.credentialID)) {
      return res.status(400).json({ error: 'Authenticator already registered' })
    }

    const update: { $push: { authenticators: Authenticator }; $set?: { key: string } } = {
      $push: { authenticators: newAuthenticator }
    }

    if (!webauthnUser?.key) {
      update.$set = { key: newAuthenticator.credentialID }
    }

    await Webauthn.findOneAndUpdate({ email }, update)
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

  res.status(200).json({ success: true, token })
}

export default handler
