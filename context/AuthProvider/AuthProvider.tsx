import React, { startTransition, useEffect } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import axios from 'config/axios'
import { authStore } from 'store/auth.atom'
import { userState } from 'store/user.atom'
import useAccountSigner from 'hooks/useAccountSigner'

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
  const { loadAccount } = useAccountSigner()

  useEffect(() => {
    if (counter > 0) return
    counter++
    if (token) {
      axios
        .get('/api/user/get')
        .then((response) => {
          startTransition(() => {
            setUser(response.data)
            loadAccount(response.data)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return <div>{children}</div>
}
