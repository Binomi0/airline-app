import { NextApiRequest, NextApiResponse } from 'next'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import { v4 as uuidv4 } from 'uuid'
import { Authenticator } from 'types'
import { connectDB } from 'lib/mongoose'
import Webauthn from 'models/Webauthn'

// Human-readable title for your website
const rpName = 'WEIFLY'
// A unique identifier for your website
const rpID = process.env.DOMAIN
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body
  await connectDB()
  const user = await Webauthn.findOne({ email: req.body.email })
  const id = uuidv4()

  const challengeResponse = generateRegistrationOptions({
    rpName,
    rpID,
    userID: user?.id ?? id,
    userName: email,
    // Don't prompt users for additional information about the authenticator
    // (Recommended for smoother UX)
    attestationType: 'none',
    // Prevent users from re-registering existing authenticators
    excludeCredentials:
      user && user.authenticators
        ? user.authenticators.map((authenticator: Authenticator) => ({
            id: authenticator.credentialID,
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

  if (!user) {
    await Webauthn.create({ id, email, challenge: challengeResponse.challenge, authenticators: [] })
  } else {
    await Webauthn.findOneAndUpdate({ email }, { $set: { challenge: challengeResponse.challenge } })
  }

  res.send(challengeResponse)
}

export default handler
