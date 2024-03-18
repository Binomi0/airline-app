import { Network, Alchemy } from 'alchemy-sdk'

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY_ETH_SEPOLIA, // Replace with your Alchemy API Key.
  network: Network.ETH_SEPOLIA // Replace with your network.
}

const alchemy = new Alchemy(settings)

export default alchemy
