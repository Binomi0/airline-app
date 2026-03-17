import { QueryClient } from '@tanstack/react-query'
import { createThirdwebClient } from 'thirdweb'
import { sepolia } from 'thirdweb/chains'

export const queryClient = new QueryClient()

export const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET is not defined in environment variables')
}

export const twClientId = process.env.NEXT_PUBLIC_TW_CLIENT_ID || 'missing-client-id'
export const twSecretKey = process.env.TW_SECRET_KEY

// Cliente para el frontend (Browser) - Solo usa Client ID
export const twClient = createThirdwebClient({
  clientId: twClientId
})

// Cliente para el backend (API/Server) - Prefiere Secret Key
// Se añade el fallback de clientId para evitar errores durante el proceso de build
// cuando las variables de entorno pueden no estar cargadas.
export const twServer = createThirdwebClient(twSecretKey ? { secretKey: twSecretKey } : { clientId: twClientId })

export const activeChain = sepolia
