import React, { useEffect } from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import type { PageProps } from 'types'
import useIvao from 'hooks/useIvao'
import { useRouter } from 'next/router'
import IvaoView from 'routes/Ivao/IvaoView'
import { userState } from 'store/user.atom'
import { useRecoilValue } from 'recoil'
import Disconnected from 'components/Disconnected'
import { ivaoUserStore } from 'store/ivao-user.atom'
import Swal from 'sweetalert2'

const IVAOPage = ({ loading }: PageProps) => {
  const router = useRouter()
  const user = useRecoilValue(userState)
  const ivaoUser = useRecoilValue(ivaoUserStore)
  const { authorize, isLoading, error } = useIvao()

  useEffect(authorize, [authorize])

  useEffect(() => {
    if (ivaoUser && !loading) {
      router.replace('/ivao')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ivaoUser])

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: error,
        text: 'Maybe a connection problem occoured, please try again.',
        icon: 'error'
      }).then(() => {
        router.replace('/ivao')
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  if (loading) return <LinearProgress />
  if (!user) return <Disconnected />

  return ivaoUser ? <IvaoView isLoading={isLoading} user={user} /> : null
}

export default IVAOPage
