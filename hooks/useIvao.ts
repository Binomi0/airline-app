import { useCallback, useState } from 'react'
import nextApiInstance from 'config/axios'
import { AxiosError, AxiosResponse } from 'axios'
import { useSetRecoilState } from 'recoil'
import { ivaoUserStore } from 'store/ivao-user.atom'
// import { useVaProviderContext } from 'context/VaProvider'

interface UseIvaoReturnType {
  isLoading: boolean
  authorize: (code: string, state: string) => void
  error: string
}

const useIvao = (): UseIvaoReturnType => {
  const setIvaoUser = useSetRecoilState(ivaoUserStore)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  // const { initIvaoAuth } = useVaProviderContext()

  const requestIvaoUser = useCallback(
    (ivaoUserToken: string) => {
      nextApiInstance
        .get('/api/ivao/user', {
          headers: {
            Authorization: `Bearer ${ivaoUserToken}`
          }
        })
        .then((response: AxiosResponse) => {
          setIvaoUser(response.data)
          localStorage.setItem('ivao-auth-token', ivaoUserToken)
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
    [setIvaoUser]
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

  const authorize = useCallback(
    (code: string, state: string) => {
      if (state && code) {
        nextApiInstance
          .get('/api/ivao/authorize', { params: { code, state } })
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
      } else {
        console.warn('Ivao returned incomplete values in the query')
      }
    },
    [requestIvaoUser]
  )

  // React.useEffect(() => {

  // }, [getPilots, initIvaoAuth, ivaoToken])

  return {
    isLoading,
    authorize,
    error
  }
}

export default useIvao
