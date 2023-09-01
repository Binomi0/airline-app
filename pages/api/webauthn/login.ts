import { NextApiRequest, NextApiResponse } from 'next'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import { Authenticator } from 'types'
import { connectDB } from 'lib/mongoose'
import Webauthn from 'models/Webauthn'

// Human-readable title for your website
const rpName = 'ELIXIR'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB()
    const user = await Webauthn.findOne({ email: req.body.email })

    if (!user) {
      res.status(404).end()
      return
    }

    const options = generateAuthenticationOptions({
      // Require users to use a previously-registered authenticator
      allowCredentials: user.authenticators.map((authenticator: Authenticator) => {
        const bufferFromBase64 = Buffer.from(authenticator.credentialID, 'base64')

        return {
          id: new Uint8Array(
            bufferFromBase64.buffer,
            bufferFromBase64.byteOffset,
            bufferFromBase64.byteLength / Uint8Array.BYTES_PER_ELEMENT
          ),
          type: 'public-key',
          // Optional
          transports: authenticator.transports
        }
      }),
      userVerification: 'discouraged'
    })

    await Webauthn.findOneAndUpdate({ email: req.body.email }, { $set: { challenge: options.challenge } })

    const challenge = {
      ...options,
      user: {
        id: user.id,
        name: user.name || user.email,
        displayName: user.displayName || user.email
      },
      rp: {
        name: rpName
      },
      pubKeyCredParams: [
        {
          alg: -7,
          type: 'public-key'
        },
        {
          alg: -8,
          type: 'public-key'
        },
        {
          alg: -257,
          type: 'public-key'
        }
      ]
    }

    res.status(200).json(challenge)
  } catch (err) {
    console.error('Login Error', err)
    res.status(500).send(err)
  }
}

export default handler
