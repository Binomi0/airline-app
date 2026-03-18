import React, { useEffect } from 'react'
import Disconnected from 'components/Disconnected'
import IvaoView from 'routes/Ivao/IvaoView'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import { useVaProviderContext } from 'context/VaProvider'
import { useRouter } from 'next/router'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'

const IVAOPage = () => {
  const router = useRouter()
  const user = useRecoilValue(userState)
  const { initIvaoAuth, setActive } = useVaProviderContext()
  const { live } = useLiveFlightProviderContext()

  React.useEffect(() => {
    if (live) router.push('/live')
  }, [live, router])

  useEffect(() => {
    setActive(true)
  }, [setActive])

  useEffect(initIvaoAuth, [initIvaoAuth])

  if (!user) return <Disconnected />

  return <IvaoView user={user} />
}

export default IVAOPage
