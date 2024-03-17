import React, { useEffect } from 'react'
import { SetterOrUpdater, useSetRecoilState } from 'recoil'
import axios from 'config/axios'
import { AxiosResponse } from 'axios'
import { authState } from 'store/auth.atom'
import { userState } from 'store/user.atom'
import { User } from 'types'

const mapResponse = (setter: SetterOrUpdater<User | undefined>) => (response: AxiosResponse<User>) =>
  setter(response.data)

export const INITIAL_STATE = {
  user: undefined,
  token: undefined
}

interface Props {
  children: React.ReactNode
  token?: string
}

export const AuthProvider = ({ children, token }: Props) => {
  const setAuthToken = useSetRecoilState(authState)
  const setUser = useSetRecoilState(userState)

  useEffect(() => {
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
  }, [setAuthToken, setUser, token])

  return <div>{children}</div>
}
