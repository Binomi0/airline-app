import { Alert, AlertTitle, Box, Button, Stack, Typography, darken } from '@mui/material'
import { useVaProviderContext } from 'context/VaProvider'
import React, { useEffect, useMemo, useState } from 'react'
import { User } from 'types'

interface Props {
  user: User
}

const IvaoStatus = ({ user }: Props) => {
  const [color, setColor] = useState('#fff')
  const { pilots } = useVaProviderContext()

  const isConnected = useMemo(
    () => pilots.some((pilot) => pilot.userId === user.vaUser?.userId),
    [pilots, user.vaUser?.userId]
  )

  useEffect(() => {
    setColor(isConnected ? '#00FF00' : '#FFF000')
  }, [isConnected])

  return (
    <Box mt={2}>
      {!user?.vaUser ? (
        <Alert severity='info'>
          <AlertTitle>Conecta tu cuenta de IVAO para continuar</AlertTitle>
          <Button variant='contained'>Add IVAO identification</Button>
        </Alert>
      ) : (
        <Stack direction='row' spacing={2} alignItems='center'>
          <div
            style={{
              width: 32,
              height: 32,
              border: `1px solid ${darken(color, 0.3)}`,
              borderRadius: '50%',
              background: `linear-gradient(270deg, ${darken(color, 0.1)}, ${darken(color, 0.7)}`
            }}
          />
          <Typography>{isConnected ? 'Estás Conectado a IVAO' : 'No estás conectado a IVAO'}</Typography>
        </Stack>
      )}
    </Box>
  )
}

export default IvaoStatus
