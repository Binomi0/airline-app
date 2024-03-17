import React from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import Disconnected from 'components/Disconnected'
import serverSidePropsHandler from 'components/ServerSideHandler'
import IvaoView from 'routes/Ivao/IvaoView'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'

interface Props {
  loading: boolean
}

const IVAOPage = ({ loading }: Props) => {
  const user = useRecoilValue(userState)

  if (loading) return <LinearProgress />
  if (!user) return <Disconnected />

  return <IvaoView user={user} />
}

export const getServerSideProps = serverSidePropsHandler

export default IVAOPage
