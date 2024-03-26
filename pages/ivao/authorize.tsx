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

const IVAOPage = ({ loading }: PageProps) => {
  const router = useRouter()
  const user = useRecoilValue(userState)
  const ivaoUser = useRecoilValue(ivaoUserStore)
  const { authorize, isLoading } = useIvao()

  useEffect(authorize, [authorize])

  useEffect(() => {
    if (ivaoUser) {
      router.replace('/ivao')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ivaoUser])

  if (loading) return <LinearProgress />
  if (!user) return <Disconnected />

  return ivaoUser ? <IvaoView isLoading={isLoading} user={user} /> : null
}

export default IVAOPage
