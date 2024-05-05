import React, { startTransition, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import axios from 'config/axios'
import { authStore } from 'store/auth.atom'
import { userState } from 'store/user.atom'
// import useWallet from 'hooks/useWallet'
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
  const token = useRecoilValue(authStore)
  const [user, setUser] = useRecoilState(userState)
  const { loadAccount } = useAccountSigner()

  useEffect(() => {
    if (token && !user) {
      if (counter > 0) return
      counter++
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
          counter = 0
        })
    }
  }, [loadAccount, setUser, token, user])

  return <div>{children}</div>
}
