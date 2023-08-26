import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise, { db } from 'lib/mongodb'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { Sepolia } from '@thirdweb-dev/chains'
import { coinTokenAddress } from 'contracts/address'
import { Collection, DB } from 'types'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end()
  if (!req.body.address) return res.status(400).end()
  if (!process.env.THIRDWEB_AUTH_PRIVATE_KEY) return res.status(403).end()

  const { address } = req.body
  const client = await clientPromise
  const collection = client.db(db).collection(Collection.wallet)

  try {
    const requested = await collection.findOne({ address })
    if (requested) {
      return res.status(202).end()
    }
    const sdk = ThirdwebSDK.fromPrivateKey(
      process.env.THIRDWEB_AUTH_PRIVATE_KEY, // Your wallet's private key (only required for write operations)
      Sepolia,
      {
        secretKey: process.env.NEXT_PUBLIC_TW_SECRET_KEY // Use secret key if using on the server, get it from dashboard settings
      }
    )
    // amount to fill to each connected address
    const amount = 2

    await sdk.wallet.transfer(address, amount, coinTokenAddress)
    await collection.insertOne({ address, amount })

    return res.status(201).end()
  } catch (error) {
    console.error('error =>', error)
    return res.status(500).json(error)
  }
}

export default handler
