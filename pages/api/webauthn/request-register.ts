import { NextApiRequest, NextApiResponse } from 'next'
import { generateRegistrationOptions, AuthenticatorTransport } from '@simplewebauthn/server'
import { v4 as uuidv4 } from 'uuid'
import { Authenticator } from 'types'
import { connectDB } from 'lib/mongoose'
import Webauthn from 'models/Webauthn'
import { isoBase64URL } from '@simplewebauthn/server/helpers'

// Human-readable title for your website
const rpName = 'WEIFLY'
// A unique identifier for your website without protocol
const rpID = process.env.NEXT_PUBLIC_DOMAIN || 'localhost'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Missing email' })
  }

  await connectDB()
  const webauthn = await Webauthn.findOne({ email })
  const id = uuidv4()

  const challengeResponse = await generateRegistrationOptions({
    rpName,
    rpID: rpID as string,
    userID: new TextEncoder().encode(webauthn?.id ?? id),
    userName: email,
    userDisplayName: email.split('@')[0],
    // (Recommended for smoother UX, but Changed to 'direct' to get AAGUID)
    attestationType: 'direct',
    timeout: 120000,
    // Prevent users from re-registering existing authenticators
    excludeCredentials:
      webauthn && webauthn.authenticators
        ? webauthn.authenticators.map((authenticator: Authenticator) => ({
            id: isoBase64URL.fromBuffer(isoBase64URL.toBuffer(authenticator.credentialID)),
            type: 'public-key',
            // Optional
            transports: authenticator.transports as AuthenticatorTransport[]
          }))
        : undefined,
    authenticatorSelection: {
      userVerification: 'preferred', // preferred, required, discouraged
      residentKey: 'preferred' // preferred, required, discouraged
    },
    supportedAlgorithmIDs: [-7, -257]
  })

  console.log(`[request-register] Generated options for ${email}:`, {
    challenge: challengeResponse.challenge,
    userID: challengeResponse.user.id,
    excludeCredentials: challengeResponse.excludeCredentials?.map((c) => ({
      id: c.id,
      transports: c.transports
    }))
  })

  if (!webauthn) {
    await Webauthn.create({ id, email, challenge: challengeResponse.challenge, authenticators: [] })
  } else {
    await Webauthn.findOneAndUpdate({ email }, { $set: { challenge: challengeResponse.challenge } })
  }

  res.send(challengeResponse)
}

export default handler
