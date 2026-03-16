import { QueryClient } from '@tanstack/react-query'
import { createThirdwebClient } from 'thirdweb'
import { sepolia } from 'thirdweb/chains'

export const queryClient = new QueryClient()

export const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET is not defined in environment variables')
}

export const twSecretKey = process.env.TW_SECRET_KEY
export const twClientId = process.env.NEXT_PUBLIC_TW_CLIENT_ID || ''

export const twClient = createThirdwebClient({
  clientId: twClientId,
  secretKey: twSecretKey
})

export const activeChain = sepolia
