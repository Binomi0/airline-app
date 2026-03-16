import { NextApiRequest, NextApiResponse } from 'next'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import { v4 as uuidv4 } from 'uuid'
import { Authenticator } from 'types'
import { connectDB } from 'lib/mongoose'
import Webauthn from 'models/Webauthn'
// import { isoBase64URL } from '@simplewebauthn/server/helpers'

// Human-readable title for your website
const rpName = 'WEIFLY'
// A unique identifier for your website without protocol
const rpID = process.env.NEXT_PUBLIC_DOMAIN

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body
  await connectDB()
  const webauthn = await Webauthn.findOne({ email: req.body.email })
  const id = uuidv4()

  const challengeResponse = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: webauthn?.id ?? id,
    userName: email,
    // Don't prompt users for additional information about the authenticator
    // (Recommended for smoother UX)
    attestationType: 'none',
    timeout: 120000,
    // Prevent users from re-registering existing authenticators
    excludeCredentials:
      webauthn && webauthn.authenticators
        ? webauthn.authenticators.map((authenticator: Authenticator) => ({
            id: Buffer.from(authenticator.credentialID, 'base64'),
            type: 'public-key',
            // Optional
            transports: authenticator.transports
          }))
        : undefined,
    authenticatorSelection: {
      userVerification: 'discouraged',
      residentKey: 'required'
    }
  })

  if (!webauthn) {
    await Webauthn.create({ id, email, challenge: challengeResponse.challenge, authenticators: [] })
  } else {
    await Webauthn.findOneAndUpdate({ email }, { $set: { challenge: challengeResponse.challenge } })
  }

  res.send(challengeResponse)
}

export default handler
