import { NextApiRequest, NextApiResponse } from 'next'
import { verifySignature } from 'utils'
import clientPromise from 'lib/mongodb'
import { Collection, DB } from 'types'
import jwt from 'jsonwebtoken'
import { setCookie } from 'cookies-next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req

  if (!body.data.response.signature) {
    res.status(500).end()
    return
  }

  const client = await clientPromise
  const db = client.db(DB.develop)
  const webauthnCollection = db.collection(Collection.webauthn)
  const user = await webauthnCollection.findOne({ email: req.body.email })

  if (!user) {
    // @ts-ignore
    throw new Error(`Could not find authenticator ${body.data.id} for user ${user?._id}`)
  }

  let verification

  try {
    verification = {
      verified: user.authenticators.some(
        // @ts-ignore
        async (authenticator) => await verifySignature(authenticator, body.data, user.challenge)
      )
    }
  } catch (error) {
    console.error(error)
    // @ts-ignore
    res.status(400).send({ error: error.message, verified: false })
    return
  }

  const token = jwt.sign({ data: { email: req.body.email } }, process.env.JWT_SECRET, { expiresIn: '1h' })
  setCookie('token', token, { req, res })
  const userCollection = db.collection(Collection.user)
  const data = await userCollection.findOne({ email: req.body.email })
  console.info({ data })
  res.send({ verified: verification.verified, id: data?.id, emailVerified: data?.emailVerified })
}

export default handler
