import { QueryClient } from '@tanstack/react-query'
import { createThirdwebClient } from 'thirdweb'
import { sepolia } from 'thirdweb/chains'

export const queryClient = new QueryClient()

export const twClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_TW_CLIENT_ID || '',
  secretKey: process.env.TW_SECRET_KEY, // Optional, for backend usage if available
})

export const activeChain = sepolia
