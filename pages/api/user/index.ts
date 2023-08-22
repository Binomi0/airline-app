import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from 'lib/mongodb'
import { Collection, DB } from 'types'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.email) return res.status(400).end()
  if (req.method === 'POST') {
    try {
      const client = await clientPromise
      const db = client.db(DB.develop).collection(Collection.user)
      const user = await db.findOne({ email: req.body.email })

      if (!user) {
        return res.status(200).send({ success: false })
      }

      return res.status(200).send({ success: true, id: user.id, emailVerified: user.emailVerified })
    } catch (err) {
      return res.status(500).send(err)
    }
  }
  return res.status(405).end()
}
export default handler
