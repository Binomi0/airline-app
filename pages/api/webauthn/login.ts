import { NextApiRequest, NextApiResponse } from 'next'
import { generateAuthenticationOptions, AuthenticatorTransport } from '@simplewebauthn/server'
import { Authenticator } from 'types'
import { connectDB } from 'lib/mongoose'
import Webauthn from 'models/Webauthn'

// Human-readable title for your website
const rpID = process.env.NEXT_PUBLIC_DOMAIN

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (!req.body.email) {
      res.status(400).end()
      return
    }
    try {
      await connectDB()
      const user = await Webauthn.findOne({ email: req.body.email })

      if (!user) {
        res.status(204).end()
        return
      }

      const options = await generateAuthenticationOptions({
        rpID: rpID as string,
        // Require users to use a previously-registered authenticator
        allowCredentials: user.authenticators.map((authenticator: Authenticator) => {
          return {
            id: (authenticator.credentialID as string).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''),
            type: 'public-key',
            // Optional
            transports: authenticator.transports as AuthenticatorTransport[]
          }
        }),
        userVerification: 'discouraged'
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
