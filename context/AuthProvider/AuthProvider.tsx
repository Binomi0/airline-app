import React, { startTransition, useEffect } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import axios from 'config/axios'
import { authStore } from 'store/auth.atom'
import { userState } from 'store/user.atom'
import useWallet from 'hooks/useWallet'

export const INITIAL_STATE = {
  user: undefined,
  token: undefined
}

interface Props {
  children: React.ReactNode
}

let counter = 0

export const AuthProvider = ({ children }: Props) => {
  const [token, setAuthToken] = useRecoilState(authStore)
  const setUser = useSetRecoilState(userState)
  const { initWallet } = useWallet()

  useEffect(() => {
    if (counter > 0) return
    counter++
    // axios.defaults.headers.common.Authorization = `Bearer ${token}`
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
          counter = 0
        })
    }
  }, [initWallet, setAuthToken, setUser, token])

  return <div>{children}</div>
}
