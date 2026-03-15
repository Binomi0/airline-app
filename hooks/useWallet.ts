/* eslint-disable no-unused-vars */
import { Wallet } from 'ethers'
import { useCallback } from 'react'
import { consentCloudSyncSwal, consentSecureWalletSwal, unlockWalletSwal, errorSwal } from 'lib/swal'
import { useSetRecoilState } from 'recoil'
import { IWallet } from 'models/Wallet'
import { walletStore } from 'store/wallet.atom'
import { getApi, postApi } from 'lib/api'
import { User } from 'types'
import { privateKeyToAccount, smartWallet } from 'thirdweb/wallets'
import { twClient, activeChain as chain } from 'config'
import { decryptVault, deriveKeyFromPRF, encryptVault } from 'utils/crypto'
import { Hex } from 'thirdweb'
import { WeiflyPRFExtensionOutputs } from 'types/webauthn'

const PRF_SALT = new TextEncoder().encode('weifly-vault-v1')

interface UseWallet {
  initWallet: (user: User) => Promise<void>
  getPRFSecret: (allowedCredentialIds?: string[]) => Promise<ArrayBuffer>
  getPrivateKey: (user: User) => Promise<string>
  syncWallet: (privateKey: string, user: User) => Promise<void>
  unlockSigner: (user: User) => Promise<any>
}

const useWallet = (): UseWallet => {
  const setWallet = useSetRecoilState(walletStore)

  const getPRFSecret = useCallback(async (allowedCredentialIds?: string[]): Promise<ArrayBuffer> => {
    try {
      const allowCredentials: PublicKeyCredentialDescriptor[] =
        allowedCredentialIds?.map((id) => ({
          id: Buffer.from(id, 'base64'),
          type: 'public-key'
        })) || []

      const credential = (await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32) as unknown as BufferSource,
          timeout: 60000,
          userVerification: 'required',
          allowCredentials,
          extensions: {
            prf: {
              eval: { first: PRF_SALT as unknown as BufferSource }
            }
          }
        }
      })) as PublicKeyCredential

      const extensionResults = credential.getClientExtensionResults()
      const prfResults = extensionResults.prf as WeiflyPRFExtensionOutputs | undefined

      if (!prfResults?.results?.first) {
        throw new Error('PRF extension not supported or failed')
      }

      return prfResults.results.first
    } catch (error) {
      console.error('Passkey PRF error:', error)
      throw error
    }
  }, [])

  const initialize = useCallback(
    async (personalAccount: any, _user: User, isCloudSynced: boolean = false) => {
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
      } catch (error) {
        console.error('Error initializing Thirdweb wallet:', error)
        throw error
      }
    },
    [setWallet]
  )

  const checkSigner = useCallback(async (signerAddress: string) => {
    const wallet = await getApi<IWallet>('/api/wallet')
    if (!wallet) throw new Error('An error has occoured while getting user wallet')
    return wallet.signerAddress.toLowerCase() === signerAddress.toLowerCase()
  }, [])

  const getPrivateKey = useCallback(
    async (_user: User): Promise<string> => {
      const storedValue = _user.id ? localStorage.getItem(_user.id) : null
      if (!storedValue) throw new Error('No local key found')

      const raw = Buffer.from(storedValue, 'base64').toString()
      try {
        const vault = JSON.parse(raw)
        if (vault.protected) {
          const { isConfirmed } = await unlockWalletSwal()
          if (!isConfirmed) throw new Error('Wallet unlocking cancelled')

          // Fetch allowed credentials to isolate passkey
          const { authenticators } = (await getApi<any>('/api/webauthn/get')) || { authenticators: [] }
          const allowedIds = authenticators.map((a: any) => a.credentialID)

          const prfSecret = await getPRFSecret(allowedIds)
          const cryptoKey = await deriveKeyFromPRF(prfSecret)
          return (await decryptVault(vault.ciphertext, cryptoKey, vault.iv)) as string
        }
        return raw.slice(0, 66)
      } catch (e) {
        if (e instanceof Error && e.message.includes('decrypt')) {
          throw new Error('Could not decrypt wallet. Is it the correct Passkey?')
        }
        // Migration Path: only if it doesn't look like a vault
        if (!raw.includes('"protected":true')) {
          return raw.slice(0, 66)
        }
        throw e
      }
    },
    [getPRFSecret]
  )

  const syncWallet = useCallback(
    async (privateKey: string, _user: User) => {
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
        } catch (e) {
          // Not a vault, will encrypt below
        }
      }

      if (!ciphertext || !iv) {
        const { isConfirmed: wantSecure } = await consentSecureWalletSwal()
        if (!wantSecure) {
          const base64Key = Buffer.from(privateKey).toString('base64')
          if (_user.id) localStorage.setItem(_user.id, base64Key)
          return
        }

        const prfSecret = await getPRFSecret()
        const cryptoKey = await deriveKeyFromPRF(prfSecret)
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
    [getPRFSecret, setWallet]
  )

  const unlockSigner = useCallback(
    async (_user: User) => {
      const privateKey = (await getPrivateKey(_user)) as `0x${string}`
      const personalAccount = privateKeyToAccount({ client: twClient, privateKey })

      const wallet = await getApi<IWallet>('/api/wallet')
      const isCloudSynced = !!wallet?.encryptedVault

      await initialize(personalAccount, _user, isCloudSynced)
      return personalAccount
    },
    [getPrivateKey, initialize]
  )

  const initWallet = useCallback(
    async (_user: User) => {
      if (!_user || !_user.id) throw new Error('Missing user while initializing wallet')

      // 0. Pre-emptive address setting (Read-only state)
      if (_user.address) {
        setWallet((prev) => ({
          ...prev,
          smartAccountAddress: _user.address as Hex,
          isLoaded: true,
          isLocked: true,
          twClient,
          twChain: chain
        }))
      }

      try {
        // 1. Initial Account check (User with no wallet yet)
        if (!_user.address) {
          const random = Wallet.createRandom()
          const privateKey = random.privateKey
          const formattedKey = (privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`) as Hex
          const personalAccount = privateKeyToAccount({ client: twClient, privateKey: formattedKey })

          await syncWallet(privateKey, _user)
          await initialize(personalAccount, _user, false)
          return
        }

        // 2. Local/Recovery check
        const storedValue = _user.id ? localStorage.getItem(_user.id) : null
        const wallet = await getApi<IWallet>('/api/wallet')

        // Case A: Cloud Recovery (New Device)
        if (!storedValue && wallet?.encryptedVault && wallet?.iv) {
          try {
            const { isConfirmed } = await unlockWalletSwal()
            if (!isConfirmed) throw new Error('Cloud recovery cancelled')

            // Fetch allowed credentials to isolate passkey
            const { authenticators } = (await getApi<any>('/api/webauthn/get')) || { authenticators: [] }
            const allowedIds = authenticators.map((a: any) => a.credentialID)

            const prfSecret = await getPRFSecret(allowedIds)
            const cryptoKey = await deriveKeyFromPRF(prfSecret)
            const privateKey = (await decryptVault(wallet.encryptedVault, cryptoKey, wallet.iv)) as `0x${string}`

            const personalAccount = privateKeyToAccount({ client: twClient, privateKey })
            if (personalAccount.address.toLowerCase() === wallet.signerAddress.toLowerCase()) {
              const vaultData = JSON.stringify({ ciphertext: wallet.encryptedVault, iv: wallet.iv, protected: true })
              if (_user.id) localStorage.setItem(_user.id, Buffer.from(vaultData).toString('base64'))
              await initialize(personalAccount, _user, true)
              return
            }
          } catch (e) {
            console.error('Cloud recovery error:', e)
            errorSwal('Recovery failed', 'Could not restore your wallet. Ensure you are using the correct Passkey.')
            return
          }
        }

        // Case B: Unlock Local Vault
        if (storedValue) {
          const raw = Buffer.from(storedValue, 'base64').toString()
          try {
            const vault = JSON.parse(raw)
            if (vault.protected) {
              try {
                const { isConfirmed } = await unlockWalletSwal()
                if (!isConfirmed) throw new Error('Local unlock cancelled')
                // Fetch allowed credentials to isolate passkey
                const { authenticators } = (await getApi<any>('/api/webauthn/get')) || { authenticators: [] }
                const allowedIds = authenticators.map((a: any) => a.credentialID)

                const prfSecret = await getPRFSecret(allowedIds)
                const cryptoKey = await deriveKeyFromPRF(prfSecret)
                const privateKey = (await decryptVault(vault.ciphertext, cryptoKey, vault.iv)) as `0x${string}`

                const personalAccount = privateKeyToAccount({ client: twClient, privateKey })
                const isCloudSynced = !!wallet?.encryptedVault
                await initialize(personalAccount, _user, isCloudSynced)
                return
              } catch (e) {
                console.error('Local unlock error:', e)
                errorSwal('Unlock failed', 'Could not decrypt your wallet. Ensure you are using the correct Passkey.')
                return
              }
            }
          } catch (e) {
            // Migration Path: Plain base64 key
            const key = raw.slice(0, 66)
            const privateKey = (key.startsWith('0x') ? key : `0x${key}`) as `0x${string}`
            const personalAccount = privateKeyToAccount({ client: twClient, privateKey })

            if (await checkSigner(personalAccount.address)) {
              await syncWallet(privateKey, _user)
              const isCloudSynced = !!wallet?.encryptedVault
              await initialize(personalAccount, _user, isCloudSynced)
              return
            }
          }
        }
      } catch (error) {
        console.error('initWallet error:', error)
        // If everything fails, the pre-emptive setWallet from step 0 might still allow read-only
      }
    },
    [checkSigner, initialize, getPRFSecret, syncWallet, setWallet]
  )

  return { initWallet, getPRFSecret, getPrivateKey, syncWallet, unlockSigner }
}

export default useWallet
