import { NextApiResponse } from 'next'
import clientPromise, { db } from 'lib/mongodb'
import { Collection } from 'types'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise
      const collection = client.db(db).collection(Collection.user)
      const user = await collection.findOne({ email: req.user }, { projection: { _id: 0 } })

      console.log({ user })
      if (!user) {
        res.status(404).end()
        return
      }

      res.status(200).send({ success: true, user: { ...user } })
      return
    } catch (err) {
      res.status(500).send(err)
      return
    }
  }
  res.status(405).end()
}
export default withAuth(handler)
