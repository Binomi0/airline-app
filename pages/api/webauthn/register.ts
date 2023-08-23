import { NextApiRequest, NextApiResponse } from 'next'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import clientPromise from 'lib/mongodb'
import { Collection, DB, Authenticator } from 'types'

// A unique identifier for your website
const rpID = process.env.DOMAIN
// The URL at which registrations and authentications should occur
const origin = process.env.ORIGIN as string

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req
  const client = await clientPromise
  const db = client.db(DB.develop)
  const webauthnCollection = db.collection(Collection.webauthn)
  const user = await webauthnCollection.findOne({ email: req.body.email })

  let verification
  try {
    verification = await verifyRegistrationResponse({
      response: body.data,
      // @ts-ignore
      expectedChallenge: user.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID
    })
  } catch (error) {
    console.error(error)
    // @ts-ignore
    return res.status(400).send({ error: error.message })
  }

  const { verified, registrationInfo } = verification
  // @ts-ignore
  const { credentialPublicKey, credentialID, counter } = registrationInfo

  const newAuthenticator: Authenticator = {
    credentialID: Buffer.from(credentialID).toString('base64'),
    credentialPublicKey: Buffer.from(credentialPublicKey).toString('base64'),
    counter
  }

  try {
    await webauthnCollection.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          key: Buffer.from(credentialID).toString('base64')
          // authenticators: user.authenticators ? [...user.authenticators, newAuthenticator] : [newAuthenticator]
        }
      }
    )
  } catch (error) {
    return res.status(500).send({ error: 'Error al actualizar key' })
  }
  try {
    await webauthnCollection.findOneAndUpdate(
      { email: req.body.email },
      {
        // @ts-ignore
        $push: {
          authenticators: newAuthenticator
        }
      }
    )
  } catch (error) {
    console.error(error)
    return res.status(500).send({ error: 'Error al actualizar authenticators' })
  }

  return res.status(200).send({ verified })
}

export default handler
