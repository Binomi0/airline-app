import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import axios from 'config/axios'
import { AxiosError, AxiosResponse } from 'axios'
import { useSetRecoilState } from 'recoil'
import { ivaoUserStore } from 'store/ivao-user.atom'
import { ivaoAuthStore } from 'store/ivaoAuth.atom'

interface UseIvaoReturnType {
  isLoading: boolean
  authorize: () => void
  error: string
}

const useIvao = (): UseIvaoReturnType => {
  const router = useRouter()
  const setIvaoUser = useSetRecoilState(ivaoUserStore)
  const setIvaoToken = useSetRecoilState(ivaoAuthStore)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const requestIvaoUser = useCallback(
    (token: string) => {
      axios
        .get('/api/ivao/user', {
          // signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response: AxiosResponse) => {
          setIvaoUser(response.data)
          setIvaoToken(token)
        })
        .catch((error: AxiosError) => {
          console.log('IVAO ERROR =>', error)
          setError('Error al conectar con IVAO')
          localStorage.removeItem('ivao-auth-token')
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [setIvaoUser, setIvaoToken]
  )

  const authorize = useCallback(() => {
    if (router.query.state && router.query.code) {
      axios
        .get('/api/ivao/authorize', { params: router.query })
        .then((response) => {
          requestIvaoUser(response.data)
        })
        .catch((err: AxiosError<{ code: number }>) => {
          if (err.response?.data.code === 11000) {
            console.error('this ivaoId is already taken')
          } else {
            console.error('err =>', err.response?.data)
          }
        })
    }
  }, [router.query, requestIvaoUser])

  useEffect(() => {
    if (!router.query.token) {
      const ivaoToken = localStorage.getItem('ivao-auth-token')
      if (!ivaoToken) {
        return setIsLoading(false)
      }
      requestIvaoUser(ivaoToken)
    } else {
      localStorage.setItem('ivao-auth-token', router.query.token as string)
      requestIvaoUser(router.query.token as string)
    }
  }, [requestIvaoUser, router.query.token])

  return { isLoading, authorize, error }
}

export default useIvao
