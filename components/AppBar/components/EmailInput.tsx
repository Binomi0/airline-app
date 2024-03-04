import Close from '@mui/icons-material/Close'
import { Stack, TextField, IconButton, Button, CircularProgress } from '@mui/material'
import React, { ChangeEvent, KeyboardEvent } from 'react'
import { validateEmail } from 'utils'

interface Props {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (email: string) => void
  onCancel: () => void
  loading: boolean
}

const EmailInput = ({ onSubmit, onCancel, loading }: Props) => {
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

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleAccess()
      }
    },
    [handleAccess]
  )

  return loading ? (
    <CircularProgress color='primary' />
  ) : (
    <Stack direction='row' spacing={2}>
      <TextField
        disabled={loading}
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
        onKeyDown={handleKeyDown}
        onChange={handleChangeEmail}
        InputProps={{
          endAdornment: (
            <IconButton onClick={onCancel}>
              <Close color='primary' />
            </IconButton>
          )
        }}
      />
      <Button disabled={loading} variant='contained' onClick={handleAccess}>
        ENTER
      </Button>
    </Stack>
  )
}

export default EmailInput
