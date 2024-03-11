import { Wallet } from 'ethers'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { useCallback, useState } from 'react'
import { alchemyEnhancedApiActions, createModularAccountAlchemyClient } from '@alchemy/aa-alchemy'
import { Hex, LocalAccountSigner, sepolia } from '@alchemy/aa-core'
import axios from 'config/axios'
import { User } from 'types'
import { missingKeySwal } from 'lib/swal'
import alchemy from 'lib/alchemy'
import useAuth from './useAuth'

// const SIMPLE_ACCOUNT_FACTORY_ADDRESS = '0x9406Cc6185a346906296840746125a0E44976454'
// const ENTRY_POINT = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'

interface UseWallet {
  // eslint-disable-next-line no-unused-vars
  initWallet: (user: User) => Promise<void>
  isLoaded: boolean
}

const useWallet = (): UseWallet => {
  const [isLoaded, setIsLoaded] = useState(false)
  const { user } = useAuth()
  const { setSmartAccountAddress, setSmartSigner, setBaseSigner } = useAlchemyProviderContext()

  const initialize = useCallback(
    async (_signer: Wallet, userId?: string) => {
      if (!_signer || !userId) return

      const signer = LocalAccountSigner.privateKeyToAccountSigner(_signer.privateKey as Hex)
      const smartAccountClient = await createModularAccountAlchemyClient({
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY_ETH_SEPOLIA,
        chain: sepolia,
        signer,
        gasManagerConfig: {
          policyId: process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID_ETH_SEPOLIA
        }
      })
      const extendedSmartAccountClient = smartAccountClient.extend(alchemyEnhancedApiActions(alchemy))
      if (!user?.address) {
        const smartAccountAddress = smartAccountClient.getAddress()

        const updateUser = axios.post('/api/user/update', { address: smartAccountAddress })
        const updateWallet = axios.post('/api/wallet', {
          id: userId,
          smartAccountAddress: smartAccountAddress,
          signerAddress: _signer.address
        })

        await Promise.all([updateUser, updateWallet])
        setSmartAccountAddress(smartAccountAddress)
      } else {
        try {
          await axios.get('/api/wallet')
        } catch (error) {
          await axios.post('/api/wallet', {
            id: user.id,
            smartAccountAddress: user.address,
            signerAddress: _signer.address
          })
        }

        setSmartAccountAddress(user.address as Hex)
      }

      setBaseSigner(_signer)
      setSmartSigner<typeof extendedSmartAccountClient>(extendedSmartAccountClient)
      setIsLoaded(true)
    },
    [setBaseSigner, setSmartAccountAddress, setSmartSigner, user]
  )

  const initWallet = useCallback(
    async (user: User) => {
      if (!user || !user.id) throw new Error('Missing user while initializing wallet')

      try {
        if (!user.address) {
          const random = Wallet.createRandom()
          const base64Key = Buffer.from(random.privateKey).toString('base64')

          localStorage.setItem(user.id, base64Key)

          await initialize(random, user.id)
          return
        }

        const walletId = localStorage.getItem(user.id)
        if (walletId) {
          const signer = new Wallet(Buffer.from(walletId, 'base64').toString().slice(0, 66))
          await initialize(signer, user.id)
          return
        } else {
          const { value: file } = await missingKeySwal()
          if (!file) {
            throw new Error('Missing file')
          }

          const reader = new FileReader()
          reader.onload = async (e) => {
            if (!e.target?.result) {
              throw new Error('Missing content file')
            }

            const base64Key = (e.target.result as string).split('base64,')[1]
            localStorage.setItem(user.id as string, base64Key)

            const key = Buffer.from(base64Key, 'base64').toString()
            initialize(new Wallet(key.slice(0, 66)), user.id)
            return
          }
          reader.readAsDataURL(file)
        }
      } catch (err) {
        console.error(err)
        throw new Error('While initialize wallet')
      }
    },
    [initialize]
  )

  return { initWallet, isLoaded }
}

export default useWallet
