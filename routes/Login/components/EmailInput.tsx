import Close from '@mui/icons-material/Close'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import React, { FC, KeyboardEvent } from 'react'
import { validateEmail } from 'utils'

interface Props {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (email: string) => Promise<void>
  onCancel: () => void
  loading: boolean
  color: 'primary' | 'secondary'
}

const EmailInput: FC<Props> = ({ onSubmit, onCancel, loading, color }: Props) => {
  const [error, setError] = React.useState('')
  const emailRef = React.useRef<HTMLInputElement>(null)

  const handleCancel = (): void => {
    if (!emailRef.current?.value) return
    emailRef.current.value = ''
    emailRef.current.focus()
    onCancel()
    setError('')
  }
  const handleAccess = React.useCallback(async () => {
    if (!emailRef.current?.value) {
      emailRef.current?.focus()
    } else {
      if (validateEmail(emailRef.current.value)) {
        if (window.PublicKeyCredential) {
          await onSubmit(emailRef.current?.value)
        } else {
          setError('WebAuthn no es compatible con este navegador.')
        }
      } else {
        setError('Por favor, introduce un correo válido.')
      }
    }
  }, [onSubmit])

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleAccess()
      }
    },
    [handleAccess]
  )

  return loading ? (
    <Stack direction='row' justifyContent='center' p={2}>
      <CircularProgress color='primary' />
    </Stack>
  ) : (
    <Stack direction='row' spacing={1} p={1}>
      <TextField
        inputRef={emailRef}
        fullWidth
        disabled={loading}
        inputProps={{
          autoComplete: 'username webauthn',
          style: { color: 'white', fontFamily: 'Sora' }
        }}
        name='username'
        color={color}
        autoFocus
        variant='standard'
        placeholder='your@email.com'
        error={!!error}
        helperText={error}
        onKeyDown={handleKeyDown}
        sx={{
          '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.1)' },
          '& .MuiInput-underline:after': { borderBottomColor: '#6366f1' },
          '& .MuiInputBase-input': { p: 1 }
        }}
        InputProps={{
          disableUnderline: false,
          endAdornment: emailRef.current?.value ? (
            <IconButton size='small' onClick={handleCancel}>
              <Close fontSize='small' sx={{ color: 'rgba(255,255,255,0.3)' }} />
            </IconButton>
          ) : null
        }}
      />
      <Button
        type='submit'
        size='medium'
        disabled={loading}
        variant='contained'
        onClick={handleAccess}
        sx={{
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
          '&:hover': {
            filter: 'brightness(1.1)',
            boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)'
          }
        }}
      >
        Continuar
      </Button>
    </Stack>
  )
}

export default EmailInput
