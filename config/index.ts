// @noErrors
import { createConfig, cookieStorage } from '@account-kit/react'
import { QueryClient } from '@tanstack/react-query'
import { alchemy, sepolia } from '@account-kit/infra'

export const config = createConfig(
  {
    transport: alchemy({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY_ETH_SEPOLIA
    }),
    chain: sepolia,
    ssr: true,
    storage: cookieStorage,
    enablePopupOauth: true,
    // For gas sponsorship
    // Learn more here: https://www.alchemy.com/docs/wallets/transactions/sponsor-gas
    policyId: process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID_ETH_SEPOLIA
  },
  {
    auth: {
      sections: [
        [{ type: 'email' }],
        [{ type: 'passkey' }, { type: 'social', authProviderId: 'google', mode: 'popup' }]
      ],
      addPasskeyOnSignup: true
    }
  }
)

export const queryClient = new QueryClient()
