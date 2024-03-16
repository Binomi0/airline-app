import { NextApiRequest, NextApiResponse } from 'next'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { Authenticator } from 'types'
import { setCookie } from 'cookies-next'
import jwt from 'jsonwebtoken'
import { connectDB } from 'lib/mongoose'
import Webauthn from 'models/Webauthn'

// A unique identifier for your website
const rpID = process.env.DOMAIN
// The URL at which registrations and authentications should occur
const origin = [process.env.ORIGIN, process.env.ORIGIN_MAIN]

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req
  await connectDB()
  const user = await Webauthn.findOne({ email: req.body.email })

  let verification
  try {
    verification = await verifyRegistrationResponse({
      response: body.data,
      expectedChallenge: user.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID
    })
  } catch (err) {
    const error = err as Error
    console.error('Register', error)
    res.status(400).send({ error: error.message })
    return
  }

  const { verified, registrationInfo } = verification
  // @ts-expect-error Registration info comes from webAuthn
  const { credentialPublicKey, credentialID, counter } = registrationInfo

  const newAuthenticator: Authenticator = {
    credentialID: Buffer.from(credentialID).toString('base64'),
    credentialPublicKey: Buffer.from(credentialPublicKey).toString('base64'),
    counter
  }

  if (!verified) {
    res.status(403).end()
    return
  }

  try {
    await Webauthn.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          key: Buffer.from(credentialID).toString('base64')
          // authenticators: user.authenticators ? [...user.authenticators, newAuthenticator] : [newAuthenticator]
        }
      }
    )
  } catch (error) {
    res.status(500).send({ error: 'Error al actualizar key' })
    return
  }
  try {
    await Webauthn.findOneAndUpdate(
      { email: req.body.email },
      {
        $push: {
          authenticators: newAuthenticator
        }
      }
    )
  } catch (error) {
    console.error('Register', error)
    res.status(500).send({ error: 'Error al actualizar authenticators' })
    return
  }

  const token = jwt.sign({ data: { email: req.body.email } }, process.env.JWT_SECRET, { expiresIn: '7d' })
  setCookie('token', token, { req, res })
  res.status(200).send({ verified, token })
}

export default handler
