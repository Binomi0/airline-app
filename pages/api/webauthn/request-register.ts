import { NextApiRequest, NextApiResponse } from 'next'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import clientPromise, { db } from 'lib/mongodb'
import { Collection } from 'types'
import { v4 as uuidv4 } from 'uuid'

// Human-readable title for your website
const rpName = 'AIRLINE'
// A unique identifier for your website
const rpID = process.env.DOMAIN as string

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body
  const client = await clientPromise
  const collection = client.db(db).collection(Collection.webauthn)
  const user = await collection.findOne({ email: req.body.email })
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
    await collection.insertOne({ id, email, challenge: challengeResponse.challenge, authenticators: [] })
  } else {
    await collection.findOneAndUpdate({ email }, { $set: { challenge: challengeResponse.challenge } })
  }

  res.send(challengeResponse)
}

export default handler
