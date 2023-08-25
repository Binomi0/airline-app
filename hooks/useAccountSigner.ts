import axios from 'config/axios'
import { Wallet } from 'ethers'
import { useCallback, useState } from 'react'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useAlchemyWallet from './useAlchemyWallet'
import { deleteCookie } from 'cookies-next'
import { getSession, useSession } from 'next-auth/react'
import { logInSwal, missingKeySwal, backupDoneSwal } from 'lib/swal'
import { AccountSignerStatus, WebAuthnUri } from 'types'

const signUpUserCheck = async (email: string): Promise<{ id: string } | null> => {
  try {
    const response = await axios.post('/api/user', { email })
    if (response.data.success) {
      return response.data
    } else {
      await axios.post('/api/user/create', { email })
      return null
    }
  } catch (err) {
    console.error(err)
    return null
  }
}
const useAccountSigner = () => {
  const { setBaseSigner, setSmartAccountAddress, setPaymasterSigner, setSmartSigner, baseSigner } =
    useAlchemyProviderContext()
  useAlchemyWallet(baseSigner)
  const [status, setStatus] = useState<AccountSignerStatus>()
  const { data: session } = useSession()

  const createCredential = useCallback(async (email: string) => {
    try {
      const responseChallenge = await axios.post(WebAuthnUri.REQUEST_REGISTER, { email })
      const request = await startRegistration(responseChallenge.data)
      const responseValidation = await axios.post<{ verified: boolean }>(WebAuthnUri.REGISTER, {
        data: request,
        email
      })

      return responseValidation.data
    } catch (err) {
      console.error(err)
      return { verified: false }
    }
  }, [])

  const signUp = useCallback(
    async (email: string) => {
      setStatus('loading')
      try {
        const data = await signUpUserCheck(email)
        if (!data || !data.id) {
          setStatus('missingKey')
          throw new Error('Error getting data id')
        }

        const credential = await createCredential(email)
        if (!credential.verified) {
          throw new Error('Error while validating credentials')
        }

        const walletId = localStorage.getItem(data.id)
        if (!walletId) {
          const random = Wallet.createRandom()
          localStorage.setItem(data.id, Buffer.from(random.privateKey).toString('base64'))

          setBaseSigner(random)
          setStatus('success')
          getSession()
        } else {
          const signer = new Wallet(Buffer.from(walletId, 'base64').toString())

          setBaseSigner(signer)
          setStatus('success')
        }
      } catch (err) {
        console.log('[signUp] Error =>', err)
        // @ts-ignore
        setStatus(err.message === 'Missing private key' ? 'missingKey' : 'error')
      }
    },
    [createCredential, setBaseSigner]
  )

  const signIn = useCallback(
    async (email: string) => {
      setStatus('loading')
      try {
        const responseChallenge = await axios.post(WebAuthnUri.LOGIN, { email })
        const request = await startAuthentication(responseChallenge.data)
        const responseValidation = await axios.post(WebAuthnUri.LOGIN_CHALLENGE, { data: request, email })

        const { verified } = responseValidation.data
        if (verified) {
          const { id } = await axios.get('/api/user/get').then((r) => r.data)
          const walletId = localStorage.getItem(id)
          if (walletId) {
            const signer = new Wallet(Buffer.from(walletId, 'base64').toString())
            setBaseSigner(signer)
            setStatus('success')
            getSession()
            logInSwal()
            return
          } else {
            const { value: file } = await missingKeySwal()
            if (file) {
              const reader = new FileReader()
              reader.onload = (e) => {
                if (!e.target?.result) {
                  throw new Error('Missing file')
                }

                const dataUrl = e.target.result as string
                const base64Data = dataUrl.split(',')[1]
                const signer = new Wallet(Buffer.from(base64Data, 'base64').toString())
                localStorage.setItem(id, base64Data)
                setBaseSigner(signer)
                setStatus('success')
                getSession()
                logInSwal()
                return
              }
              reader.readAsDataURL(file)
            } else {
              throw new Error('Missing file')
            }
          }
        } else {
          console.log('ERROR WHITE')
          setStatus('error')
        }
      } catch (err) {
        console.log('err =>', err)
        // @ts-ignore
        setStatus(err?.message === 'Missing wallet key' ? 'missingKey' : 'error')
      }
    },
    [setBaseSigner]
  )

  const signOut = useCallback(() => {
    setBaseSigner(undefined)
    setSmartAccountAddress(undefined)
    setPaymasterSigner(undefined)
    setSmartSigner(undefined)
    deleteCookie('token')
  }, [setBaseSigner, setPaymasterSigner, setSmartAccountAddress, setSmartSigner])

  const addBackup = useCallback(
    async () => {
      // @ts-ignore
      if (!session?.user?.email || !session?.user?.id) {
        throw new Error('Missing required email')
      }
      try {
        const credential = await createCredential(session.user.email)
        if (credential.verified) {
          // @ts-ignore
          const walletId = localStorage.getItem(session.user.id)
          if (!walletId) {
            const random = Wallet.createRandom()
            // @ts-ignore
            if (!session.user.id) {
              setStatus('missingKey')
              throw new Error('missing Id')
            }

            backupDoneSwal()
            // @ts-ignore
            localStorage.setItem(session.user.id, Buffer.from(random.privateKey).toString('base64'))

            setBaseSigner(random)
            setStatus('missingKey')
            return
          }
          const signer = new Wallet(Buffer.from(walletId, 'base64').toString())
          setBaseSigner(signer)
          setStatus('success')
        }
      } catch (err) {
        console.log('[signUp] Error =>', err)
        // @ts-ignore
        setStatus(err.message === 'Missing private key' ? 'missingKey' : 'error')
      }
    },
    // @ts-ignore
    [createCredential, session?.user?.email, session?.user?.id, setBaseSigner]
  )

  return {
    addBackup,
    signUp,
    signIn,
    signOut,
    status
  }
}

export default useAccountSigner
