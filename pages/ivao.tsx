import React from 'react'
import { LinearProgress } from '@mui/material'
import Disconnected from 'components/Disconnected'
import serverSidePropsHandler from 'components/ServerSideHandler'
import useAuth from 'hooks/useAuth'
import IvaoView from 'routes/Ivao/IvaoView'

interface Props {
  loading: boolean
}

const IVAOPage = ({ loading }: Props) => {
  const { user } = useAuth()

  if (loading) return <LinearProgress />
  if (!user) return <Disconnected />

  return <IvaoView user={user} />
}

export const getServerSideProps = serverSidePropsHandler

export default IVAOPage
