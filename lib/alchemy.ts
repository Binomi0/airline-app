import { Alchemy, Network } from 'alchemy-sdk'
import { activeChain } from 'config'

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY_ETH_SEPOLIA, // Replace with your Alchemy API Key.
  network: activeChain.id === 11155111 ? Network.ETH_SEPOLIA : Network.ARB_MAINNET
}

const alchemy = new Alchemy(settings)

export default alchemy
