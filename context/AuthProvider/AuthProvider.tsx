import React, { startTransition, useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import axios from 'config/axios'
import { authState } from 'store/auth.atom'
import { userState } from 'store/user.atom'
import { getCookie } from 'cookies-next'
import useWallet from 'hooks/useWallet'

export const INITIAL_STATE = {
  user: undefined,
  token: undefined
}

interface Props {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: Props) => {
  const setAuthToken = useSetRecoilState(authState)
  const setUser = useSetRecoilState(userState)
  const { initWallet } = useWallet()

  useEffect(() => {
    const token = getCookie('token') as string
    if (token) {
      console.log('Refrescando sessión')
      axios
        .get('/api/user/get')
        .then((response) => {
          startTransition(() => {
            setUser(response.data)
            initWallet(response.data)
          })
        })

        .catch((err) => {
          console.error('AuthProvider error =>', err)
        })
        .finally(() => {
          setAuthToken(token)
        })
    }
  }, [initWallet, setAuthToken, setUser])

  return <div>{children}</div>
}
