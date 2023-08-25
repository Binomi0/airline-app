import clientPromise from 'lib/mongodb'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import { Collection, DB } from 'types'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (!req.body.address) return res.status(400).end()

    const { address } = req.body
    const client = await clientPromise
    const collection = client.db(DB.develop).collection(Collection.user)

    await collection.findOneAndUpdate({ email: req.user }, { $set: { address } })

     res.status(202).end()
  }

   res.status(405).end()
}

export default withAuth(handler)
