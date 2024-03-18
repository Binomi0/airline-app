import React, { useEffect } from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import Disconnected from 'components/Disconnected'
import IvaoView from 'routes/Ivao/IvaoView'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import type { PageProps } from 'types'
import { useVaProviderContext } from 'context/VaProvider'

const IVAOPage = ({ loading }: PageProps) => {
  const user = useRecoilValue(userState)
  const { initIvaoData } = useVaProviderContext()

  useEffect(initIvaoData, [initIvaoData])

  if (loading) return <LinearProgress />
  if (!user) return <Disconnected />

  return <IvaoView user={user} />
}

export default IVAOPage
