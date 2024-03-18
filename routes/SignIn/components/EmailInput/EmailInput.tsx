import Close from '@mui/icons-material/Close'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import React, { FC, FormEventHandler, KeyboardEvent } from 'react'
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
        // Availability of `window.PublicKeyCredential` means WebAuthn is usable.
        if (window.PublicKeyCredential && PublicKeyCredential.isConditionalMediationAvailable) {
          // Check if conditional mediation is available.
          const isCMA = await PublicKeyCredential.isConditionalMediationAvailable()
          if (isCMA) {
            // Call WebAuthn authentication
            await onSubmit(emailRef.current?.value)
          }
        }
      } else {
        setError('Insert a valid email please.')
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
    <CircularProgress color='primary' />
  ) : (
    <Stack direction='row' spacing={2}>
      <TextField
        inputRef={emailRef}
        fullWidth
        focused
        disabled={loading}
        inputProps={{
          autoComplete: 'username webauthn',
          style: { color: 'white' }
        }}
        name='username'
        color={color}
        autoFocus
        variant='outlined'
        size='small'
        label='EMAIL'
        error={!!error}
        helperText={error}
        placeholder='Insert your email'
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleCancel}>
              <Close color={error ? 'error' : color} />
            </IconButton>
          )
        }}
      />
      <Button
        type='submit'
        size='small'
        sx={{ px: 5 }}
        disabled={loading}
        variant='contained'
        color={color}
        onClick={handleAccess}
      >
        continue
      </Button>
    </Stack>
  )
}

export default EmailInput
