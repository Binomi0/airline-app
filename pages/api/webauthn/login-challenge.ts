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
  const auth = await Webauthn.findOne({ email: req.body.email })

  if (!auth) {
    throw new Error(`Could not find authenticator ${body.data.id} for auth ${auth?._id}`)
  }

  let verification

  try {
    verification = {
      verified: auth.authenticators.some(
        async (authenticator: Authenticator) => await verifySignature(authenticator, body.data, auth.challenge)
      )
    }
  } catch (err) {
    const error = err as Error
    console.error('Login verification error:', error)
    res.status(400).send({ error: error.message, verified: false })
    return
  }

  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      throw new Error(`Missing user ${user.email}`)
    }
    const token = jwt.sign({ data: { email: req.body.email, id: user.id } }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })
    setCookie('token', token, { req, res })
    res.send({ verified: verification.verified, id: user?.id, emailVerified: user?.emailVerified })
    return
  } catch (err) {
    console.error('login-response error =>', err)
    res.status(500).send(err)
  }
}

export default handler
