import { NextApiRequest, NextApiResponse } from 'next'
import { VerifiedRegistrationResponse, verifyRegistrationResponse } from '@simplewebauthn/server'
import { Authenticator } from 'types'
import { setCookie } from 'cookies-next'
import jwt from 'jsonwebtoken'
import { connectDB } from 'lib/mongoose'
import Webauthn from 'models/Webauthn'
import { jwtSecret } from 'config'
import { UAParser } from 'ua-parser-js'

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
  let registrationInfo: VerifiedRegistrationResponse['registrationInfo']
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

  if (!verified || !registrationInfo) {
    res.status(403).json({ error: 'Verification failed' })
    return
  }

  const { credential } = registrationInfo

  const userAgent = req.headers['user-agent'] || ''
  const parser = new UAParser(userAgent)
  const result = parser.getResult()
  const transports = data.response.transports || []
  const isHybrid = transports.includes('hybrid')
  const aaguid = registrationInfo?.aaguid || ''

  // Common AAGUIDs for identification
  const AAGUID_MAP: Record<string, string> = {
    '749ba0c8-af48-4a92-8ddb-77c20973cef8': 'Apple Device',
    'ad06a0ed-ce53-43eb-b357-123456789012': 'Windows Hello',
    '00000000-0000-0000-0000-000000000000': 'Passkey',
    'ea9b6d66-bf42-42d6-b922-376374c4148e': 'Google / Android',
    'f0f624c9-66bf-42d6-b922-376374c4148e': 'Google / Android'
  }

  const knownDevice = AAGUID_MAP[aaguid.toLowerCase()]

  let deviceName = 'Unknown Device'
  const osName = result.os.name || ''
  const browserName = result.browser.name || ''
  const deviceModel = result.device.model || ''

  if (isHybrid) {
    // If it's hybrid, it's definitely a cross-device mobile registration (QR code)
    deviceName = knownDevice && knownDevice !== 'Passkey' ? knownDevice : 'Mobile Device'
    if (browserName) {
      deviceName = `${deviceName} (${browserName})`
    }
  } else if (knownDevice && knownDevice !== 'Passkey') {
    deviceName = knownDevice
    if (browserName) {
      deviceName = `${deviceName} (${browserName})`
    }
  } else if (osName) {
    deviceName = osName
    if (deviceModel) {
      deviceName = deviceModel
    } else if (osName === 'iOS' || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      deviceName = userAgent.includes('iPad') ? 'iPad' : 'iPhone'
    }

    if (browserName) {
      deviceName = `${deviceName} (${browserName})`
    }
  } else if (browserName) {
    deviceName = browserName
  }

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
