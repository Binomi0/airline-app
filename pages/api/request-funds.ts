import { NextApiResponse } from 'next'
import clientPromise, { db } from 'lib/mongodb'
import { coinTokenAddress } from 'contracts/address'
import { Collection } from 'types'
import { CustomNextApiRequest } from 'lib/withAuth'
import sdk from 'lib/twSdk'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }
  if (!req.body.smartAccountAddress || !req.body.smartAccountAddress) {
    res.status(400).end()
    return
  }
  if (!process.env.THIRDWEB_AUTH_PRIVATE_KEY) {
    res.status(403).end()
    return
  }

  const { smartAccountAddress } = req.body
  const client = await clientPromise
  const collection = client.db(db).collection(Collection.wallet)

  try {
    const requested = await collection.findOne({ smartAccountAddress })
    if (requested) {
      res.status(202).end()
      return
    }

    // amount to fill to each connected smartAccountAddress
    const amount = 2

    sdk.wallet.transfer(smartAccountAddress, amount, coinTokenAddress)
    await collection.insertOne({
      email: req.user,
      smartAccountAddress: req.body.smartAccountAddress,
      signerAddress: req.body.signerAddress,
      amount,
      starterGift: true
    })

    res.status(201).end()
  } catch (error) {
    console.error('error =>', error)
    res.status(500).json(error)
  }
}

export default handler
