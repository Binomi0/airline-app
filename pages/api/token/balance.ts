import { Network, Alchemy } from 'alchemy-sdk'
import withAuth from 'lib/withAuth'
import { NextApiRequest, NextApiResponse } from 'next'

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY_ETH_SEPOLIA, // Replace with your Alchemy API Key.
  network: Network.ETH_SEPOLIA // Replace with your network.
}
const alchemy = new Alchemy(settings)

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }
  if (!req.body.address || !req.body.token) {
    res.status(400).send
    return
  }

  try {
    const response = await alchemy.core.getTokenBalances(req.body.address, [req.body.token])

    res.status(200).send(response)
  } catch (error) {
    console.error('error =>', error)
    res.status(400).send(error)
  }
}

export default withAuth(handler)
