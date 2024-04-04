import React, { useEffect } from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import Disconnected from 'components/Disconnected'
import IvaoView from 'routes/Ivao/IvaoView'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import type { PageProps } from 'types'
import { useVaProviderContext } from 'context/VaProvider'
import { useRouter } from 'next/router'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'

const IVAOPage = ({ loading }: PageProps) => {
  const router = useRouter()
  const user = useRecoilValue(userState)
  const { initIvaoAuth } = useVaProviderContext()
  // const { authorize, isLoading } = useIvao()
  const { live } = useLiveFlightProviderContext()

  React.useEffect(() => {
    if (live) router.push('/live')
  }, [live, router])

  useEffect(() => {
    initIvaoAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // useEffect(authorize, [authorize])

  if (loading) return <LinearProgress />
  if (!user) return <Disconnected />

  return <IvaoView isLoading={false} user={user} />
}

export default IVAOPage
