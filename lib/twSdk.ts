import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { Sepolia } from '@thirdweb-dev/chains'

const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.THIRDWEB_AUTH_PRIVATE_KEY, // Your wallet's private key (only required for write operations)
  Sepolia,
  {
    secretKey: process.env.NEXT_PUBLIC_TW_SECRET_KEY // Use secret key if using on the server, get it from dashboard settings
  }
)

export default sdk
