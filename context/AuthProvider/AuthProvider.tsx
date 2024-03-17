import React, { useEffect } from 'react'
import { SetterOrUpdater, useSetRecoilState } from 'recoil'
import axios from 'config/axios'
import { authState } from 'store/auth.atom'
import { userState } from 'store/user.atom'
import { getCookie } from 'cookies-next'
import type { AxiosResponse } from 'axios'
import type { User } from 'types'

const mapResponse = (setter: SetterOrUpdater<User | undefined>) => (response: AxiosResponse<User>) =>
  setter(response.data)

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

  useEffect(() => {
    const token = getCookie('token') as string
    if (token) {
      axios
        .get('/api/user/get')
        .then(mapResponse(setUser))
        .catch((err) => {
          console.error('AuthProvider error =>', err)
        })
        .finally(() => {
          setAuthToken(token)
        })
    }
  }, [setAuthToken, setUser])

  return <div>{children}</div>
}
