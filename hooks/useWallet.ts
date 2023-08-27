import { Wallet } from 'ethers'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { useCallback, useState } from 'react'
import { withAlchemyGasManager } from '@alchemy/aa-alchemy'
import { Hex, SimpleSmartAccountOwner, SimpleSmartContractAccount, SmartAccountProvider } from '@alchemy/aa-core'
import { sepolia } from '@wagmi/chains'
import axios from 'config/axios'
import { useAuthProviderContext } from 'context/AuthProvider'

const SIMPLE_ACCOUNT_FACTORY_ADDRESS = '0x9406Cc6185a346906296840746125a0E44976454'
const ENTRY_POINT = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'

interface UseWallet {
  initWallet: (id: string) => void
  isLoaded: boolean
}

const useWallet = (): UseWallet => {
  const [isLoaded, setIsLoaded] = useState(false)
  const { user } = useAuthProviderContext()
  const { setBaseSigner, setSmartAccountAddress, setPaymasterSigner, setSmartSigner } = useAlchemyProviderContext()

  const initialize = useCallback(
    async (signer: Wallet) => {
      if (!signer) return

      const owner: SimpleSmartAccountOwner = {
        // @ts-ignore
        signMessage: async (msg) => signer.signMessage(msg),
        getAddress: async () => signer.address as Hex,
        // @ts-ignore
        signTypedData: signer.signTypedData
      }

      const smartSigner = new SmartAccountProvider(
        // the demo key below is public and rate-limited, it's better to create a new one
        // you can get started with a free account @ https://www.alchemy.com/
        process.env.NEXT_PUBLIC_ALCHEMY_URL_ETH_SEPOLIA || '', // rpcUrl
        ENTRY_POINT, // entryPointAddress
        sepolia // chain
      ).connect(
        (rpcClient) =>
          new SimpleSmartContractAccount({
            entryPointAddress: ENTRY_POINT,
            chain: sepolia,
            factoryAddress: SIMPLE_ACCOUNT_FACTORY_ADDRESS,
            rpcClient,
            owner,
            // optionally if you already know the account's address
            accountAddress: user?.address ? (user.address as Hex) : ('' as Hex)
          })
      )

      const newPaymasterSigner = withAlchemyGasManager(smartSigner, {
        policyId: process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID_ETH_SEPOLIA || '',
        entryPoint: ENTRY_POINT
      })

      if (!user?.address) {
        const address = await smartSigner.account.getAddress()

        if (user) {
          const updateUser = axios.post('/api/user/update', { address })
          const updateWallet = axios.post('/api/wallet', {
            id: user.id,
            smartAccountAddress: address,
            signerAddress: signer.address
          })

          await Promise.all([updateUser, updateWallet])
        }
        setSmartAccountAddress(address)
      } else {
        try {
          await axios.get('/api/wallet')
        } catch (error) {
          const updateUser = axios.post('/api/user/update', { address: user.address })
          const updateWallet = axios.post('/api/wallet', {
            id: user.id,
            smartAccountAddress: user.address,
            signerAddress: signer.address
          })

          await Promise.all([updateUser, updateWallet])
        }
        setSmartAccountAddress(user.address as Hex)
      }

      setBaseSigner(signer)
      setSmartSigner(smartSigner)
      setPaymasterSigner(newPaymasterSigner)
      setIsLoaded(true)
    },
    [setBaseSigner, setPaymasterSigner, setSmartAccountAddress, setSmartSigner, user]
  )

  const initWallet = useCallback(
    (id: string) => {
      const walletId = localStorage.getItem(id)
      if (!walletId) {
        const random = Wallet.createRandom()
        localStorage.setItem(id, Buffer.from(random.privateKey).toString('base64'))

        initialize(random)
      } else {
        const signer = new Wallet(Buffer.from(walletId, 'base64').toString())

        initialize(signer)
      }
    },
    [initialize]
  )

  return { initWallet, isLoaded }
}

export default useWallet
