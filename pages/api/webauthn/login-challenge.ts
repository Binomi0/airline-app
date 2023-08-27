import { NextApiRequest, NextApiResponse } from 'next'
import { verifySignature } from 'utils'
import jwt from 'jsonwebtoken'
import { setCookie } from 'cookies-next'
import { connectDB } from 'lib/mongoose'
import Webauthn from 'models/Webauthn'
import { Authenticator } from 'types'
import User from 'models/User'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req

  if (!body.data.response.signature) {
    res.status(500).end()
    return
  }

  await connectDB()
  const user = await Webauthn.findOne({ email: req.body.email })

  if (!user) {
    throw new Error(`Could not find authenticator ${body.data.id} for user ${user?._id}`)
  }

  let verification

  try {
    verification = {
      verified: user.authenticators.some(
        async (authenticator: Authenticator) => await verifySignature(authenticator, body.data, user.challenge)
      )
    }
  } catch (err) {
    const error = err as Error
    console.error(error)
    res.status(400).send({ error: error.message, verified: false })
    return
  }

  const token = jwt.sign({ data: { email: req.body.email } }, process.env.JWT_SECRET, { expiresIn: '1h' })
  setCookie('token', token, { req, res })
  const data = await User.findOne({ email: req.body.email })
  console.info({ data })
  res.send({ verified: verification.verified, id: data?.id, emailVerified: data?.emailVerified })
}

export default handler
