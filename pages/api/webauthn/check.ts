import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise, { db } from 'lib/mongodb'
import { Collection } from 'types'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (!req.body.email) return res.status(400).end()
    try {
      const client = await clientPromise
      const collection = client.db(db).collection(Collection.webauthn)
      const user = await collection.findOne({ email: req.body.email })

      if (!user || !user.authenticators.length) {
        res.status(200).send({ success: false })
        return
      }

      res.status(200).send({ success: true })
      return
    } catch (err) {
      res.status(500).send(err)
      return
    }
  }

  res.status(405).end()
}
export default handler
