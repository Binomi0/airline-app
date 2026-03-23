import { NextApiRequest, NextApiResponse } from 'next'
import { generateAuthenticationOptions, AuthenticatorTransport } from '@simplewebauthn/server'
import { Authenticator } from 'types'
import { connectDB } from 'lib/mongoose'
import Webauthn from 'models/Webauthn'
import { isoBase64URL } from '@simplewebauthn/server/helpers'


// Human-readable title for your website
const rpID = process.env.NEXT_PUBLIC_DOMAIN || 'localhost'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (!req.body.email) {
      res.status(400).end()
      return
    }
    try {
      await connectDB()
      const auth = await Webauthn.findOne({ email: req.body.email })

      if (!auth) {
        res.status(204).end()
        return
      }

      const options = await generateAuthenticationOptions({
        rpID: rpID as string,
        // Require users to use a previously-registered authenticator
        allowCredentials: auth.authenticators.map((authenticator: Authenticator) => {
          return {
            id: isoBase64URL.fromBuffer(isoBase64URL.toBuffer(authenticator.credentialID)),
            type: 'public-key',
            // Optional
            transports: authenticator.transports as AuthenticatorTransport[]
          }
        }),
        userVerification: 'preferred'
      })

      console.log(`[login] Options for ${req.body.email}:`, {
        challenge: options.challenge,
        allowCredentials: options.allowCredentials?.map((c) => ({
          id: c.id,
          transports: c.transports
        }))
      })

      await Webauthn.findOneAndUpdate({ email: req.body.email }, { $set: { challenge: options.challenge } })
      res.status(200).json(options)
      return
    } catch (err) {
      console.error('Login Error', err)
      res.status(500).send(err)
      return
    }
  }
  res.status(405).end()
}

export default handler
