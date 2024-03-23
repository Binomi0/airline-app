import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import axios from 'config/axios'
import { AxiosError, AxiosResponse } from 'axios'
import { IvaoUser } from 'types'

interface UseIvaoReturnType {
  ivaoUser?: IvaoUser
  isLoading: boolean
}

const useIvao = (): UseIvaoReturnType => {
  const router = useRouter()
  const [ivaoUser, setIvaoUser] = useState<IvaoUser>()
  const [isLoading, setIsLoading] = useState(true)

  const requestIvaoUser = useCallback((token: string) => {
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
  }, [])

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

  return { ivaoUser, isLoading }
}

export default useIvao
