'use client'

import { Contract, Wallet, ethers } from 'ethers'
import { useCallback } from 'react'
import { createModularAccountAlchemyClient } from '@alchemy/aa-alchemy'
import { EntryPointAbi, Hex, LocalAccountSigner, SmartAccountSigner, sepolia } from '@alchemy/aa-core'
import { accountImportErrorSwal, missingKeySwal } from 'lib/swal'
import { useSetRecoilState } from 'recoil'
import { IWallet } from 'models/Wallet'
import { walletStore } from 'store/wallet.atom'
import { getApi, postApi } from 'lib/api'
import { User } from 'types'
import { provider } from 'lib/clientWallet'
import { getBaseInitCode, getSender } from 'utils/testutils'
import { AccountFactory, EntryPoint } from 'typechain-types'
import { AF_ADDR, EP_ADDR } from 'contracts/address/local'
import AccountFactoryJSON from 'contracts/abi/AccountFactory.json'

// const SIMPLE_ACCOUNT_FACTORY_ADDRESS = '0x9406Cc6185a346906296840746125a0E44976454'
// const ENTRY_POINT = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'

interface UseWallet {
  // eslint-disable-next-line no-unused-vars
  initWallet: (user: User) => Promise<void>
  // eslint-disable-next-line no-unused-vars
  initCustomWallet: (user: User) => Promise<void>
}

const useWallet = (): UseWallet => {
  const setWallet = useSetRecoilState(walletStore)

  const initialize = useCallback(
    async (signer: SmartAccountSigner, _user: User) => {
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

      if (!_user.address) {
        const smartAccountAddress = modularAccountAlchemyClient.getAddress()

        const updateUser = postApi('/api/user/update', { address: smartAccountAddress })
        const updateWallet = postApi('/api/wallet', {
          id: _user.id,
          smartAccountAddress: smartAccountAddress,
          signerAddress: await signer.getAddress()
        })

        await Promise.all([updateUser, updateWallet])
        setWallet({
          baseSigner: signer,
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
            signerAddress: await signer.getAddress()
          })
        }
        setWallet({
          baseSigner: signer,
          smartSigner: smartAccountClient,
          paymasterSigner: modularAccountAlchemyClient,
          smartAccountAddress: _user.address,
          isLoaded: true
        })
      }
    },
    [setWallet]
  )

  const checkSigner = useCallback(async (address: string) => {
    const wallet = await getApi<IWallet>('/api/wallet')

    if (!wallet) {
      throw new Error('An error has occoured while getting user wallet')
    }

    if (wallet.signerAddress !== address) {
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
          const isValidWallet = await checkSigner(baseSigner.address)

          if (isValidWallet && _user.id) {
            localStorage.setItem(_user.id, base64Key)
            const localSigner = LocalAccountSigner.privateKeyToAccountSigner(baseSigner.privateKey as Hex)

            await initialize(localSigner, _user)
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

  const initCustomWallet = useCallback(
    async (_user: User) => {
      const wallet = await getApi<IWallet>('/api/wallet')

      if (!wallet) {
        const random = new Wallet('0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d')

        console.log({ wallet })
        const accountFactory = new Contract(AF_ADDR, AccountFactoryJSON.abi, random) as AccountFactory
        const initCode = getBaseInitCode(accountFactory, random.address)

        const entryPoint = new Contract(EP_ADDR, EntryPointAbi, random) as unknown as EntryPoint
        try {
          const sender = await getSender(entryPoint, initCode)
          console.log({ sender })
        } catch (error) {
          console.error(error)
        }
        // const rpcSigner = new ethers.providers.JsonRpcSigner({}, provider, sender as string)
        // console.log({ rpcSigner })

        // const updateUser = postApi('/api/user/update', { address: sender })
        // const updateWallet = postApi('/api/wallet', {
        //   id: _user.id,
        //   smartAccountAddress: sender,
        //   signerAddress: random.address
        // })

        // await Promise.all([updateUser, updateWallet])
        // setWallet({
        //   baseSigner: undefined,
        //   smartSigner: undefined,
        //   paymasterSigner: undefined,
        //   smartAccountAddress: sender as string,
        //   isLoaded: true
        // })
      } else {
        // setWallet({
        //   baseSigner: undefined,
        //   smartSigner: undefined,
        //   paymasterSigner: undefined,
        //   smartAccountAddress: wallet.smartAccountAddress,
        //   isLoaded: true
        // })
      }
    },
    [setWallet]
  )

  const initWallet = useCallback(
    async (_user: User) => {
      if (!_user.id) throw new Error('Missing user while initializing wallet')

      try {
        if (!_user.address) {
          // This is where the wallet is created for the first time?
          const random = Wallet.createRandom()

          const base64Key = Buffer.from(random.privateKey).toString('base64')

          localStorage.setItem(_user.id, base64Key)
          const localSigner = LocalAccountSigner.privateKeyToAccountSigner(random.privateKey as Hex)

          await initialize(localSigner, _user)
          return
        }

        const walletId = localStorage.getItem(_user.id)
        if (walletId) {
          const signer = new Wallet(Buffer.from(walletId, 'base64').toString().slice(0, 66))
          const localSigner = LocalAccountSigner.privateKeyToAccountSigner(signer.privateKey as Hex)

          if (await checkSigner(signer.address)) {
            await initialize(localSigner, _user)
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

  return { initWallet, initCustomWallet }
}

export default useWallet
