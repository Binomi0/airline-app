import React from 'react'
import { Box, Container, LinearProgress, Typography } from '@mui/material'
import Disconnected from 'components/Disconnected'
import serverSidePropsHandler from 'components/ServerSideHandler'
import useAuth from 'hooks/useAuth'
import IvaoStatus from 'routes/Ivao/components/IvaoStatus'

interface Props {
  loading: boolean
}

const IVAOPage = ({ loading }: Props) => {
  const { user } = useAuth()

  if (loading) return <LinearProgress />
  if (!user) return <Disconnected />

  return (
    <Container>
      <IvaoStatus user={user} />
      <Box mt={10}>
        <Typography
          textTransform='uppercase'
          letterSpacing={-0.6}
          fontFamily='B612 Mono'
          paragraph
          textAlign='center'
          variant='h2'
        >
          IVAO Active Flights
        </Typography>

        {/* <IvaoView /> */}
      </Box>
    </Container>
  )
}

export const getServerSideProps = serverSidePropsHandler

export default IVAOPage
