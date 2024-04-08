import { Wallet } from 'ethers'
import { useCallback } from 'react'
import { createModularAccountAlchemyClient } from '@alchemy/aa-alchemy'
import { Hex, LocalAccountSigner, sepolia } from '@alchemy/aa-core'
import { accountImportErrorSwal, missingKeySwal } from 'lib/swal'
import { useSetRecoilState } from 'recoil'
import { IWallet } from 'models/Wallet'
import { walletStore } from 'store/wallet.atom'
import { getApi, postApi } from 'lib/api'
import { User } from 'types'

// const SIMPLE_ACCOUNT_FACTORY_ADDRESS = '0x9406Cc6185a346906296840746125a0E44976454'
// const ENTRY_POINT = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'

interface UseWallet {
  // eslint-disable-next-line no-unused-vars
  initWallet: (user: User) => Promise<void>
}

const useWallet = (): UseWallet => {
  const setWallet = useSetRecoilState(walletStore)

  const initialize = useCallback(
    async (_signer: Wallet, _user: User) => {
      if (!_signer || !_user.id) return

      const signer = LocalAccountSigner.privateKeyToAccountSigner(_signer.privateKey as Hex)
      const modularAccountAlchemyClient = await createModularAccountAlchemyClient({
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY_ETH_SEPOLIA,
        chain: sepolia,
        signer,
        gasManagerConfig: {
          policyId: process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID_ETH_SEPOLIA
        }
      })

      const smartAccountClient = await createModularAccountAlchemyClient({
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY_ETH_SEPOLIA,
        chain: sepolia,
        signer,
        useSimulation: true
      })

      if (!_user?.address) {
        const smartAccountAddress = modularAccountAlchemyClient.getAddress()

        const updateUser = postApi('/api/user/update', { address: smartAccountAddress })
        const updateWallet = postApi('/api/wallet', {
          id: _user.id,
          smartAccountAddress: smartAccountAddress,
          signerAddress: _signer.address
        })

        await Promise.all([updateUser, updateWallet])
        setWallet({
          baseSigner: _signer,
          smartSigner: smartAccountClient,
          paymasterSigner: modularAccountAlchemyClient,
          smartAccountAddress,
          isLoaded: true
        })
      } else {
        try {
          await getApi('/api/wallet')
        } catch (error) {
          await postApi('/api/wallet', {
            id: _user.id,
            smartAccountAddress: _user.address,
            signerAddress: _signer.address
          })
        }
        setWallet({
          baseSigner: _signer,
          smartSigner: smartAccountClient,
          paymasterSigner: modularAccountAlchemyClient,
          smartAccountAddress: _user.address,
          isLoaded: true
        })
      }
    },
    [setWallet]
  )

  const checkSigner = useCallback(async (signer: Wallet) => {
    const wallet = await getApi<IWallet>('/api/wallet')

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
    async (_user: User) => {
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

          if (isValidWallet && _user.id) {
            localStorage.setItem(_user.id, base64Key)
            await initialize(baseSigner, _user)
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
    async (_user: User) => {
      if (!_user || !_user.id) throw new Error('Missing user while initializing wallet')

      try {
        // This is where the wallet is created for the first time?
        if (!_user.address) {
          console.log('initWallet user has no address')
          const random = Wallet.createRandom()
          const base64Key = Buffer.from(random.privateKey).toString('base64')

          localStorage.setItem(_user.id, base64Key)

          await initialize(random, _user)
          return
        }

        const walletId = localStorage.getItem(_user.id)
        if (walletId) {
          const signer = new Wallet(Buffer.from(walletId, 'base64').toString().slice(0, 66))
          if (await checkSigner(signer)) {
            await initialize(signer, _user)
          }
          return
        } else {
          console.log('initWallet user has no walletid in storage')
          await handleImportFile(_user)
        }
      } catch (error) {
        const err = error as Error
        console.error(err)
        if (err.message === 'Invalid wallet') {
          await accountImportErrorSwal()
          await handleImportFile(_user)
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
