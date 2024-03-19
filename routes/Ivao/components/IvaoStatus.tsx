import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { darken } from '@mui/material/styles'
import axios from 'config/axios'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { pilotsStore } from 'store/pilots.atom'
import { userState } from 'store/user.atom'
import { User } from 'types'

interface Props {
  user: User
}

const IvaoStatus = ({ user }: Props) => {
  const setUser = useSetRecoilState(userState)
  const [color, setColor] = useState('#fff')
  const pilots = useRecoilValue(pilotsStore)
  console.log({ pilots })

  const inputRef = useRef<HTMLInputElement>()

  const isFlying = useMemo(
    () => pilots.some((pilot) => pilot?.userId.toString() === user.vaUser?.pilotId),
    [pilots, user.vaUser?.pilotId]
  )

  const handleAddIVAOUser = useCallback(async () => {
    if (!inputRef.current?.value) return

    try {
      await axios.post('/api/user/add-ivao', {
        vaUser: { type: 'IVAO', pilotId: inputRef.current.value }
      })

      setUser({ ...user, vaUser: { type: 'IVAO', pilotId: inputRef.current.value } })
    } catch (err) {
      console.error(err)
    }
  }, [setUser, user])

  useEffect(() => {
    setColor(isFlying ? '#00FF00' : '#FFF000')
  }, [isFlying])

  return (
    <Box my={2}>
      {!user?.vaUser ? (
        <Alert severity='info'>
          <AlertTitle>Conecta tu cuenta de IVAO para continuar</AlertTitle>
          <Stack direction='row' justifyContent='center' alignItems='center' spacing={2}>
            <TextField size='small' inputRef={inputRef} />
            <Button onClick={handleAddIVAOUser} variant='contained'>
              Add IVAO identification
            </Button>
          </Stack>
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
