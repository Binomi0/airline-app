'use client'

import { Wallet } from 'ethers'
import { useCallback } from 'react'
import { accountImportErrorSwal, missingKeySwal } from 'lib/swal'
import { useSetRecoilState } from 'recoil'
import { IWallet } from 'models/Wallet'
import { walletStore } from 'store/wallet.atom'
import { getApi, postApi } from 'lib/api'
import { User } from 'types'
import { createThirdwebClient } from 'thirdweb'
import { privateKeyToAccount, smartWallet } from 'thirdweb/wallets'
import { twClient, activeChain as chain } from 'config'

interface UseWallet {
  // eslint-disable-next-line no-unused-vars
  initWallet: (user: User) => Promise<void>
}

const useWallet = (): UseWallet => {
  const setWallet = useSetRecoilState(walletStore)

  const initialize = useCallback(
    async (personalAccount: any, _user: User) => {
      if (!personalAccount || !_user.id) return

      try {
        const account = await smartWallet({
          chain,
          sponsorGas: true
        }).connect({
          client: twClient,
          personalAccount
        })

        const smartAccountAddress = account.address

        if (!_user?.address) {
          const updateUser = postApi('/api/user/update', { address: smartAccountAddress })
          const updateWallet = postApi('/api/wallet', {
            id: _user.id,
            smartAccountAddress: smartAccountAddress,
            signerAddress: personalAccount.address
          })

          await Promise.all([updateUser, updateWallet])
        } else {
          try {
            await getApi('/api/wallet')
          } catch (error) {
            await postApi('/api/wallet', {
              id: _user.id,
              smartAccountAddress: _user.address,
              signerAddress: personalAccount.address
            })
          }
        }

        setWallet({
          baseSigner: personalAccount,
          smartSigner: account,
          smartAccountAddress: _user.address || smartAccountAddress,
          isLoaded: true,
          twClient,
          twChain: chain
        })
      } catch (error) {
        console.error('Error initializing Thirdweb wallet:', error)
        throw error
      }
    },
    [setWallet]
  )

  const checkSigner = useCallback(async (signerAddress: string) => {
    const wallet = await getApi<IWallet>('/api/wallet')

    if (!wallet) {
      throw new Error('An error has occoured while getting user wallet')
    }

    if (wallet.signerAddress.toLowerCase() !== signerAddress.toLowerCase()) {
      return false
    }
    return true
  }, [])

  const handleImportFile = useCallback(
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
          const privateKey = key.slice(0, 66)

          const personalAccount = privateKeyToAccount({
            client: twClient,
            privateKey: privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`
          })

          const isValidWallet = await checkSigner(personalAccount.address)

          if (isValidWallet && _user.id) {
            localStorage.setItem(_user.id, base64Key)
            await initialize(personalAccount, _user)
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
        if (!_user.address) {
          console.log('initWallet user has no address')

          const random = Wallet.createRandom()
          const privateKey = random.privateKey
          const base64Key = Buffer.from(privateKey).toString('base64')

          const personalAccount = privateKeyToAccount({
            client: twClient,
            privateKey
          })

          localStorage.setItem(_user.id, base64Key)
          await initialize(personalAccount, _user)
          return
        }

        const walletId = localStorage.getItem(_user.id)
        if (walletId) {
          const key = Buffer.from(walletId, 'base64').toString().slice(0, 66)
          const privateKey = key.startsWith('0x') ? key : `0x${key}`

          const personalAccount = privateKeyToAccount({
            client: twClient,
            privateKey
          })

          if (await checkSigner(personalAccount.address)) {
            await initialize(personalAccount, _user)
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
