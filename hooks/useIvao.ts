import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import axios from 'config/axios'
import { AxiosError, AxiosResponse } from 'axios'
import { useSetRecoilState } from 'recoil'
import { ivaoUserStore } from 'store/ivao-user.atom'

interface UseIvaoReturnType {
  isLoading: boolean
  authorize: () => void
}

const useIvao = (): UseIvaoReturnType => {
  const router = useRouter()
  const setIvaoUser = useSetRecoilState(ivaoUserStore)
  const [isLoading, setIsLoading] = useState(true)

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
        })
        .catch((error: AxiosError) => {
          console.log('IVAO ERROR =>', error)
          localStorage.removeItem('ivao-auth-token')
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [setIvaoUser]
  )

  const authorize = useCallback(() => {
    if (router.query.state && router.query.code) {
      axios
        .get('/api/ivao/authorize', { params: router.query })
        .then((response) => {
          requestIvaoUser(response.data)
        })
        .catch((err: AxiosError) => {
          console.error('err =>', err.response?.data)
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

  return { isLoading, authorize }
}

export default useIvao
