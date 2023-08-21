import { NextApiRequest, NextApiResponse } from 'next'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import clientPromise from 'lib/mongodb'
import { Collection, DB } from 'types'

// Human-readable title for your website
const rpName = 'ELIXIR'
// A unique identifier for your website
const rpID = 'localhost'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { _id: id, email } = req.body
  const client = await clientPromise
  const db = client.db(DB.develop).collection(Collection.webauthn)
  const user = await db.findOne({ email: req.body.email })

  const challengeResponse = generateRegistrationOptions({
    rpName,
    rpID,
    userID: id,
    userName: email,
    // Don't prompt users for additional information about the authenticator
    // (Recommended for smoother UX)
    attestationType: 'none',
    // Prevent users from re-registering existing authenticators
    excludeCredentials:
      user && user.authenticators
        ? // @ts-ignore
          user.authenticators.map((authenticator) => ({
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
    await db.insertOne({ id, email, challenge: challengeResponse.challenge })
  } else {
    await db.findOneAndUpdate({ email }, { $set: { challenge: challengeResponse.challenge } })
  }

  res.send(challengeResponse)
}

export default handler
