import clientPromise from 'lib/mongodb'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import { Collection, DB } from 'types'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (!req.body.smartAccountAddress) return res.status(400).end()
    if (!req.body.signerAddress) return res.status(400).end()
    try {
      const client = await clientPromise
      const db = client.db(DB.develop).collection(Collection.wallet)
      await db.findOneAndUpdate(
        { email: req.user },
        { $set: { smartAccountAddress: req.body.smartAccountAddress, signerAddress: req.body.signerAddress } },
        { upsert: true }
      )

      return res.status(200).end()
    } catch (err) {
      return res.status(500).send(err)
    }
  }

  return res.status(405).end()
}

export default withAuth(handler)
