import { NextApiRequest, NextApiResponse } from 'next'
import { generateAuthenticationOptions, AuthenticatorTransport } from '@simplewebauthn/server'
import { Authenticator } from 'types'
import { connectDB } from 'lib/mongoose'
import Webauthn from 'models/Webauthn'
import { isoBase64URL } from '@simplewebauthn/server/helpers'

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
      const baseBytes = new TextEncoder().encode('weifly-vault-v1').buffer
      const hashBuffer = await crypto.subtle.digest('SHA-256', baseBytes)
      const prfSaltBase64 = isoBase64URL.fromBuffer(new Uint8Array(hashBuffer))

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
        userVerification: 'preferred',
        extensions: {
          // @ts-expect-error prf is not defined in the type
          prf: {
            eval: {
              first: prfSaltBase64
            }
          }
        }
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
