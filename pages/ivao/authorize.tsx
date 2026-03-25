import React, { useCallback, useEffect } from 'react'
import useIvao from 'hooks/useIvao'
import { useRouter } from 'next/router'
import IvaoView from 'routes/Ivao/IvaoView'
import { userState } from 'store/user.atom'
import { useRecoilValue } from 'recoil'
import Disconnected from 'components/Disconnected'
import { ivaoUserStore } from 'store/ivao-user.atom'
import Swal from 'sweetalert2'

const IVAOPage = () => {
  const router = useRouter()
  const user = useRecoilValue(userState)
  const ivaoUser = useRecoilValue(ivaoUserStore)
  const { authorize, error } = useIvao()

  const redirect = useCallback(() => {
    if (user && !user.onboarded) {
      router.replace('/onboarding')
    } else {
      router.replace('/ivao')
    }
  }, [router, user])

  useEffect(() => {
    if (router.isReady && router.query.code) {
      authorize(router.query.code as string, router.query.state as string)
    }
  }, [authorize, router.isReady, router.query.code, router.query.state])

  useEffect(() => {
    if (ivaoUser) {
      redirect()
    }
  }, [ivaoUser, redirect])

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: error,
        text: 'Maybe a connection problem occoured, please try again.',
        icon: 'error'
      }).then(() => {
        redirect()
      })
    }
  }, [error, redirect])

  if (!user) return <Disconnected />

  return ivaoUser ? <IvaoView user={user} /> : null
}

export default IVAOPage
