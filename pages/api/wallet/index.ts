import clientPromise, { db } from 'lib/mongodb'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import { Collection } from 'types'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (!req.body.smartAccountAddress || !req.body.signerAddress ) {
      res.status(400).end()
      return
    }
    try {
      const client = await clientPromise
      const current = client.db(db)
      const walletCollection = current.collection(Collection.wallet)
      const userCollection = current.collection(Collection.user)

      const wallet = await walletCollection.findOne({ email: req.user })
      await userCollection.findOneAndUpdate({ email: req.user }, { $set: { address: req.body.smartAccountAddress } })
      if (!wallet?.starterGift) {
        res.redirect('/api/request-funds')
        return
      }

      res.status(202).end()
      return
    } catch (err) {
      res.status(500).send(err)
      return
    }
  }

  res.status(405).end()
}

export default withAuth(handler)
