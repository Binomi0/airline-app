/* eslint-disable no-unused-vars */
import { generatePrivateKey } from 'viem/accounts'
import { useCallback } from 'react'
import { consentCloudSyncSwal, unlockWalletSwal } from 'lib/swal'
import { useSetRecoilState } from 'recoil'
import { IWallet } from 'models/Wallet'
import { walletStore } from 'store/wallet.atom'
import { getApi, postApi } from 'lib/api'
import { User } from 'types'
import { Account, privateKeyToAccount, smartWallet } from 'thirdweb/wallets'
import { twClient, activeChain as chain } from 'config'
import { decryptVault, deriveKeyFromPRF, encryptVault } from 'utils/crypto'
import { Hex } from 'thirdweb'
import useAccountSigner from 'hooks/useAccountSigner'

export const baseBytes = new TextEncoder().encode('weifly-vault-v1').buffer

interface UseWallet {
  initWallet: (user: User) => Promise<void>
  getPrivateKey: (user: User) => Promise<string>
  syncWallet: (privateKey: string, user: User) => Promise<void>
  unlockSigner: (user: User) => Promise<Account | null>
}

const useWallet = (): UseWallet => {
  const setWallet = useSetRecoilState(walletStore)
  const { verifyCredential } = useAccountSigner()

  // #2
  const initialize = useCallback(
    async (personalAccount: Account, _user: User, isCloudSynced: boolean = false) => {
      if (!personalAccount || !_user.id) return null

      try {
        const { sponsorGas } = (await getApi<{ sponsorGas: boolean }>(
          `/api/user/sponsorship?address=${_user.address || ''}`
        )) || { sponsorGas: false }

        const account = await smartWallet({
          chain,
          sponsorGas
        }).connect({
          client: twClient,
          personalAccount
        })

        const smartAccountAddress = account.address

        if (!_user?.address) {
          await Promise.all([
            postApi('/api/user/update', { address: smartAccountAddress }),
            postApi('/api/wallet', {
              id: _user.id,
              smartAccountAddress: smartAccountAddress,
              signerAddress: personalAccount.address
            })
          ])
        }

        setWallet({
          smartAccountAddress: (_user.address || smartAccountAddress) as `0x${string}`,
          isLoaded: true,
          isLocked: !personalAccount,
          baseSigner: personalAccount,
          smartSigner: account,
          isCloudSynced,
          twClient,
          twChain: chain
        })

        return account
      } catch (error) {
        console.error('Error initializing Thirdweb wallet:', error)
        throw error
      }
    },
    [setWallet]
  )

  const getPrivateKey = useCallback(
    async (_user: User): Promise<string> => {
      if (!_user.email) throw new Error('User email is required')

      const storedValue = _user.id ? localStorage.getItem(_user.id) : null
      if (!storedValue) throw new Error('No local key found')

      const raw = Buffer.from(storedValue, 'base64').toString()
      try {
        const vault = JSON.parse(raw)
        if (vault.protected) {
          const { isConfirmed } = await unlockWalletSwal()
          if (!isConfirmed) throw new Error('Wallet unlocking cancelled')

          // // Fetch allowed credentials to isolate passkey
          // const { authenticators } = (await getApi<IWebauthn>('/api/webauthn/get')) || { authenticators: [] }
          // const allowedIds = authenticators.map((a: Authenticator) => a.credentialID)

          const { prfSecret, verified } = await verifyCredential(_user.email)
          if (!verified || !prfSecret) throw new Error('Could not verify credential')
          const cryptoKey = await deriveKeyFromPRF(prfSecret)
          return (await decryptVault(vault.ciphertext, cryptoKey, vault.iv)) as string
        }
        throw new Error('Wallet is not protected. Please re-encrypt.')
      } catch (e) {
        if (e instanceof Error && e.message.includes('decrypt')) {
          throw new Error('Could not decrypt wallet. Is it the correct Passkey?')
        }
        throw e
      }
    },
    [verifyCredential]
  )

  // #3
  // Receives a private key and encrypts it using the PRF secret
  // Then it syncs it with the backend
  const syncWallet = useCallback(
    async (privateKey: string, _user: User) => {
      if (!_user.email) throw new Error('User email is required')

      let ciphertext = ''
      let iv = ''

      const storedValue = _user.id ? localStorage.getItem(_user.id) : null
      if (storedValue) {
        try {
          const vault = JSON.parse(Buffer.from(storedValue, 'base64').toString())
          if (vault.protected) {
            ciphertext = vault.ciphertext
            iv = vault.iv
          }
        } catch {
          // Not a vault, will encrypt below
        }
      }

      if (!ciphertext || !iv) {
        console.log('private key =>', { privateKey })
        // Encryption is mandatory for security
        const { prfSecret } = await verifyCredential(_user.email)
        const cryptoKey = await deriveKeyFromPRF(prfSecret!)
        const encrypted = await encryptVault(privateKey, cryptoKey)
        ciphertext = encrypted.ciphertext
        iv = encrypted.iv

        const vaultData = JSON.stringify({ ciphertext, iv, protected: true })
        if (_user.id) {
          localStorage.setItem(_user.id, Buffer.from(vaultData).toString('base64'))
        }
      }

      const { isConfirmed: wantSync } = await consentCloudSyncSwal()
      if (wantSync && ciphertext && iv) {
        await postApi('/api/wallet/backup', {
          encryptedVault: ciphertext,
          iv: iv
        })
        setWallet((prev) => ({ ...prev, isCloudSynced: true }))
      }
    },
    [setWallet, verifyCredential]
  )

  const unlockSigner = useCallback(
    async (_user: User) => {
      const privateKey = (await getPrivateKey(_user)) as `0x${string}`
      console.log('private key =>', { privateKey })
      const personalAccount = privateKeyToAccount({ client: twClient, privateKey })

      const wallet = await getApi<IWallet>('/api/wallet')
      const isCloudSynced = !!wallet?.encryptedVault

      return await initialize(personalAccount, _user, isCloudSynced)
    },
    [getPrivateKey, initialize]
  )

  // #1
  const initWallet = useCallback(
    async (_user: User) => {
      if (!_user || !_user.id) throw new Error('Missing user while initializing wallet')

      try {
        // 1. Fetch wallet from API to discover state
        const wallet = await getApi<IWallet>('/api/wallet')
        const isCloudSynced = !!wallet?.encryptedVault
        const smartAccountAddress = (_user.address || wallet?.smartAccountAddress) as Hex | undefined

        // 2. Set discovery state (Read-only / Locked)
        setWallet((prev) => ({
          ...prev,
          smartAccountAddress: smartAccountAddress || prev.smartAccountAddress,
          isLoaded: true,
          isLocked: true,
          isCloudSynced,
          twClient,
          twChain: chain
        }))

        // 3. New User Flow: Initial Account check (User with no wallet yet in local or cloud)
        const storedValue = _user.id ? localStorage.getItem(_user.id) : null
        if (!smartAccountAddress && !storedValue && !isCloudSynced) {
          const privateKey = generatePrivateKey()
          const personalAccount = privateKeyToAccount({ client: twClient, privateKey })

          await initialize(personalAccount, _user, false)
          await syncWallet(privateKey, _user)
          return
        }
      } catch (error) {
        console.error('initWallet error:', error)
      }
    },
    [initialize, setWallet, syncWallet]
  )

  return { initWallet, getPrivateKey, syncWallet, unlockSigner }
}

export default useWallet
