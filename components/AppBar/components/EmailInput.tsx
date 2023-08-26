import { Close } from '@mui/icons-material'
import { Stack, TextField, IconButton, Button } from '@mui/material'
import React, { ChangeEvent } from 'react'
import { validateEmail } from 'utils'

interface Props {
  onSubmit: (email: string) => void
  onCancel: () => void
}

const EmailInput = ({ onSubmit, onCancel }: Props) => {
  const [email, setEmail] = React.useState('')
  const [error, setError] = React.useState('')
  const emailRef = React.useRef<HTMLInputElement>(null)

  const handleAccess = React.useCallback(() => {
    if (!email) {
      emailRef.current?.focus()
    } else {
      if (validateEmail(email)) {
        onSubmit(email)
      } else {
        setError('Invalid email')
      }
    }
  }, [email, onSubmit])

  const handleChangeEmail = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }, [])

  return (
    <Stack direction='row' spacing={2}>
      <TextField
        inputProps={{
          style: { color: 'white' }
        }}
        autoFocus
        variant='outlined'
        size='small'
        label='EMAIL'
        error={!!error}
        helperText={error}
        placeholder='Insert your email'
        value={email}
        onChange={handleChangeEmail}
        InputProps={{
          endAdornment: (
            <IconButton onClick={onCancel}>
              <Close color='primary' />
            </IconButton>
          )
        }}
      />
      <Button disabled={status === 'loading'} variant='contained' onClick={handleAccess}>
        ENTER
      </Button>
    </Stack>
  )
}

export default EmailInput
