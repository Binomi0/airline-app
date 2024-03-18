import { Wallet } from 'ethers'
import { useCallback } from 'react'
import { alchemyEnhancedApiActions, createModularAccountAlchemyClient } from '@alchemy/aa-alchemy'
import { Hex, LocalAccountSigner, sepolia } from '@alchemy/aa-core'
import axios from 'config/axios'
import { User } from 'types'
import { accountImportErrorSwal, missingKeySwal } from 'lib/swal'
import alchemy from 'lib/alchemy'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { userState } from 'store/user.atom'
import { IWallet } from 'models/Wallet'
import { walletStore } from 'store/wallet.atom'

// const SIMPLE_ACCOUNT_FACTORY_ADDRESS = '0x9406Cc6185a346906296840746125a0E44976454'
// const ENTRY_POINT = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'

interface UseWallet {
  // eslint-disable-next-line no-unused-vars
  initWallet: (user: User) => Promise<void>
}

const useWallet = (): UseWallet => {
  const user = useRecoilValue(userState)
  const setWallet = useSetRecoilState(walletStore)

  const initialize = useCallback(
    async (_signer: Wallet, userId: string) => {
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
        setWallet({ baseSigner: _signer, smartSigner: extendedSmartAccountClient, smartAccountAddress, isLoaded: true })
      } else {
        try {
          await axios.get('/api/wallet')
        } catch (error) {
          await axios.post('/api/wallet', {
            id: userId,
            smartAccountAddress: user.address,
            signerAddress: _signer.address
          })
        }
        setWallet({
          baseSigner: _signer,
          smartSigner: extendedSmartAccountClient,
          smartAccountAddress: user.address,
          isLoaded: true
        })
      }
    },
    [setWallet, user?.address]
  )

  const checkSigner = useCallback(async (signer: Wallet) => {
    const response = await axios.get<IWallet>('/api/wallet')
    const wallet = response.data

    if (!wallet) {
      throw new Error('An error has occoured while getting user wallet')
    }

    if (wallet.signerAddress !== signer.address) {
      return false
    }
    return true
  }, [])

  /**
   * Get this out of this file, pure function
   */
  const handleImportFile = useCallback(
    // eslint-disable-next-line no-unused-vars
    async (userId: string) => {
      const { value: file } = await missingKeySwal()
      if (!file) {
        throw new Error('Missing file')
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = async (e) => {
          if (!e.target?.result) {
            throw new Error('Missing content file')
          }

          const base64Key = (e.target.result as string).split('base64,')[1]

          const key = Buffer.from(base64Key, 'base64').toString()
          const baseSigner = new Wallet(key.slice(0, 66))
          const isValidWallet = await checkSigner(baseSigner)

          if (isValidWallet) {
            localStorage.setItem(userId, base64Key)
            await initialize(baseSigner, userId)
            resolve(true)
          } else {
            reject(new Error('Invalid wallet'))
          }
        }
        reader.readAsDataURL(file)
      })
    },
    [checkSigner, initialize]
  )

  const initWallet = useCallback(
    async (user: User) => {
      if (!user || !user.id) throw new Error('Missing user while initializing wallet')

      try {
        // This is where the wallet is created for the first time?
        if (!user.address) {
          console.log('initWallet user has no address')
          const random = Wallet.createRandom()
          const base64Key = Buffer.from(random.privateKey).toString('base64')

          localStorage.setItem(user.id, base64Key)

          await initialize(random, user.id)
          return
        }

        const walletId = localStorage.getItem(user.id)
        if (walletId) {
          const signer = new Wallet(Buffer.from(walletId, 'base64').toString().slice(0, 66))
          if (await checkSigner(signer)) {
            await initialize(signer, user.id)
          }
          return
        } else {
          console.log('initWallet user has no walletid in storage')
          await handleImportFile(user.id)
        }
      } catch (error) {
        const err = error as Error
        console.error(err)
        if (err.message === 'Invalid wallet') {
          await accountImportErrorSwal()
          await handleImportFile(user.id)
          return
        }
        throw new Error('While initialize wallet')
      }
    },
    [checkSigner, handleImportFile, initialize]
  )

  return { initWallet }
}

export default useWallet
