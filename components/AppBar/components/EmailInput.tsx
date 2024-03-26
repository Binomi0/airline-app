import Close from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import React, { ChangeEvent, KeyboardEvent } from 'react'
import { validateEmail } from 'utils'

interface Props {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (email: string) => void
  onCancel: () => void
  loading: boolean
  color: 'primary' | 'secondary'
}

const EmailInput = ({ onSubmit, onCancel, loading, color }: Props) => {
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
          autoComplete: 'username webauthn',
          style: { color: 'white' }
        }}
        color={color}
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
              <Close color={color} />
            </IconButton>
          )
        }}
      />
      <Button disabled={loading} variant='contained' color={color} onClick={handleAccess}>
        ENTER
      </Button>
    </Stack>
  )
}

export default EmailInput
