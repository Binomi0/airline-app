import { NextApiRequest, NextApiResponse } from 'next'
import { verifySignature } from 'utils'
import clientPromise from 'lib/mongodb'
import { Collection, DB } from 'types'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req

  if (!body.data.response.signature) {
    return res.status(500).end()
  }

  const client = await clientPromise
  const db = client.db(DB.develop).collection(Collection.webauthn)
  const user = await db.findOne({ email: req.body.email })

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
    return res.status(400).send({ error: error.message, verified: false })
  }

  res.send(verification)
}

export default handler
