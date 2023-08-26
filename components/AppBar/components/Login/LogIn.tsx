import { Close } from '@mui/icons-material'
import { Stack, TextField, IconButton, Button } from '@mui/material'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useAccountSigner from 'hooks/useAccountSigner'
import { signedOutSwal } from 'lib/swal'
import React, { useCallback, useRef } from 'react'
import { validateEmail } from 'utils'

const LogIn = () => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const { signIn, signOut, status } = useAccountSigner()
  const [requestCode, setRequestCode] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const codeRef = useRef<HTMLInputElement>(null)

  const handleSignIn = React.useCallback(async (email: string) => validateEmail(email) && signIn(email), [signIn])

  const handleSignOut = React.useCallback(async () => {
    const confirm = await signedOutSwal()
    if (confirm) {
      signOut()
    }
  }, [signOut])

  const handleAccess = React.useCallback(() => {
    if (requestCode) {
      if (!inputRef.current?.value) {
        setRequestCode(false)
        return
      }

      if (validateEmail(inputRef.current.value)) {
        setEmail(inputRef.current.value)
        handleSignIn(inputRef.current.value)
      }
    } else {
      setRequestCode(true)
    }
  }, [handleSignIn, requestCode])

  const handleValidateCode = useCallback(async () => {
    const code = codeRef.current?.value

    if (!email || !code) {
      throw new Error('Missing email or code')
    }

    try {
      await axios.post('/api/user/validate', { code, email })
      await handleSignUp(email)
      setSnack({ open: true, message: 'Validation code is OK!', status: 'success' })
      setCreating(undefined)
    } catch (err) {
      setSnack({ open: true, message: 'Validation code wrong :(', status: 'warning' })
      console.error('[handleValidateCode] ERROR =>', err)
      codeRef.current.value = ''
    }
  }, [email, handleSignUp])

  const renderLogin = useCallback(() => {
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
          placeholder='Insert your email'
          inputRef={inputRef}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setCreating(undefined)}>
                <Close color='primary' />
              </IconButton>
            )
          }}
        />
        <Button disabled={status === 'loading'} variant='contained' onClick={handleAccess}>
          SEND
        </Button>
      </Stack>
    )
  }, [handleAccess, status])

  const renderCode = React.useCallback(() => {
    return (
      <Stack direction='row' spacing={2}>
        <TextField
          inputProps={{
            style: { color: 'white' }
          }}
          autoFocus
          variant='outlined'
          size='small'
          label='CODE'
          placeholder='Insert code'
          inputRef={codeRef}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setCreating(undefined)}>
                <Close />
              </IconButton>
            )
          }}
        />
        <Button variant='contained' onClick={handleValidateCode}>
          SEND
        </Button>
      </Stack>
    )
  }, [])

  return smartAccountAddress ? (
    <Button disabled={status === 'loading'} variant='contained' color='error' onClick={handleSignOut}>
      Log Out
    </Button>
  ) : requestCode ? (
    renderCode()
  ) : (
    renderLogin()
  )
}

export default LogIn
