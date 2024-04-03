import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import axios from 'config/axios'
import { AxiosError, AxiosResponse } from 'axios'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { ivaoUserStore } from 'store/ivao-user.atom'
import { ivaoAuthStore } from 'store/ivaoAuth.atom'
// import { useVaProviderContext } from 'context/VaProvider'

interface UseIvaoReturnType {
  isLoading: boolean
  authorize: () => void
  error: string
}

const useIvao = (): UseIvaoReturnType => {
  const router = useRouter()
  const setIvaoUser = useSetRecoilState(ivaoUserStore)
  const [ivaoToken, setIvaoToken] = useRecoilState(ivaoAuthStore)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  // const { initIvaoAuth } = useVaProviderContext()

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
          localStorage.setItem('ivao-auth-token', token)
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

  // const checkExistingIvaoToken = useCallback(() => {
  //   if (ivaoToken === undefined) {
  //     initIvaoAuth()
  //     return false
  //   } else if (ivaoToken === null) {
  //     return false
  //   }

  //   const _ivaoToken = localStorage.getItem('ivao-auth-token')
  //   if (!_ivaoToken) return false

  //   requestIvaoUser(_ivaoToken)
  //   return true
  // }, [initIvaoAuth, ivaoToken, requestIvaoUser])

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
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [router.query, requestIvaoUser])

  // React.useEffect(() => {

  // }, [getPilots, initIvaoAuth, ivaoToken])

  return {
    isLoading,
    authorize,
    error
  }
}

export default useIvao
