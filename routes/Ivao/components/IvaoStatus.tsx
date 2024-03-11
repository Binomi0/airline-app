import { Alert, AlertTitle, Box, Button, Stack, TextField, Typography, darken } from '@mui/material'
import axios from 'config/axios'
import { useAuthProviderContext } from 'context/AuthProvider'
import { useVaProviderContext } from 'context/VaProvider'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { User } from 'types'

interface Props {
  user: User
}

const IvaoStatus = ({ user }: Props) => {
  const { signIn } = useAuthProviderContext()
  const [color, setColor] = useState('#fff')
  const { pilots } = useVaProviderContext()
  const inputRef = useRef<HTMLInputElement>()

  const isFlying = useMemo(
    () => pilots.some((pilot) => pilot.userId.toString() === user.vaUser?.pilotId),
    [pilots, user.vaUser?.pilotId]
  )

  const handleAddIVAOUser = useCallback(async () => {
    if (!inputRef.current?.value) return

    try {
      await axios.post('/api/user/add-ivao', {
        vaUser: { type: 'IVAO', pilotId: inputRef.current.value }
      })

      signIn({ ...user, vaUser: { type: 'IVAO', pilotId: inputRef.current.value } })
    } catch (err) {
      console.error(err)
    }
  }, [signIn, user])

  useEffect(() => {
    setColor(isFlying ? '#00FF00' : '#FFF000')
  }, [isFlying])

  return (
    <Box my={2}>
      {!user?.vaUser ? (
        <Alert severity='info'>
          <AlertTitle>Conecta tu cuenta de IVAO para continuar</AlertTitle>
          <TextField inputRef={inputRef} />
          <Button onClick={handleAddIVAOUser} variant='contained'>
            Add IVAO identification
          </Button>
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
          <Typography>Estás Conectado a IVAO</Typography>
        </Stack>
      )}
    </Box>
  )
}

export default IvaoStatus