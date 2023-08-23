import { Network, Alchemy } from 'alchemy-sdk'
import { NextApiRequest, NextApiResponse } from 'next'

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY_ETH_SEPOLIA, // Replace with your Alchemy API Key.
  network: Network.ETH_SEPOLIA // Replace with your network.
}
const alchemy = new Alchemy(settings)

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const response = await alchemy.core.getTokenBalances(req.body.address, [req.body.token])

    return res.status(200).send(response)
  } catch (error) {
    console.error('error =>', error)
    return res.status(500).send(error)
  }
}

export default handler
