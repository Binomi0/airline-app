import { NextApiResponse } from 'next'
import clientPromise from 'lib/mongodb'
import { Collection, DB } from 'types'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise
      const db = client.db(DB.develop).collection(Collection.user)
      const user = await db.findOne({ email: req.user })

      if (!user) {
        res.status(404).end()
        return
      }

      res.status(200).send({ success: true, id: user.id, emailVerified: user.emailVerified })
      return
    } catch (err) {
      res.status(500).send(err)
      return
    }
  }
  res.status(405).end()
}
export default withAuth(handler)
