import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Add, Close, Logout, Send } from '@mui/icons-material'
import { Alert, IconButton, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Swal from 'sweetalert2'
import useAccountSigner from 'hooks/useAccountSigner'

type AppBarSnackStatus = 'success' | 'error' | 'warning' | 'info'
interface AppBarSnack {
  open: boolean
  message: string
  status: AppBarSnackStatus
}

const initialSnackState: AppBarSnack = { open: false, message: '', status: 'success' }

const validateEmail = (email: string) => {
  const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return expression.test(email)
}

export default function BasicMenu() {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [email, setEmail] = React.useState('')
  const { signUp, signIn, signOut, addBackup, status } = useAccountSigner()
  const [creating, setCreating] = React.useState<CreatingState>()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const codeRef = React.useRef<HTMLInputElement>(null)
  const { data: session } = useSession()
  const [snack, setSnack] = React.useState<AppBarSnack>(initialSnackState)

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleSignUp = React.useCallback((email: string) => validateEmail(email) && signUp(email), [signUp])
  const handleSignIn = React.useCallback((email: string) => validateEmail(email) && signIn(email), [signIn])

  const handleValidateCode = React.useCallback(async () => {
    const code = codeRef.current?.value

    if (!email || !code) return

    try {
      await axios.post('/api/user/validate', { code, email })
      handleSignUp(email)
      setCreating(undefined)
    } catch (err) {
      console.error('[handleValidateCode] ERROR =>', err)
      codeRef.current.value = ''
    }
  }, [email, handleSignUp])

  const handleAccess = React.useCallback(async () => {
    if (!inputRef.current?.value) {
      throw new Error('Missing email')
    }
    const email = inputRef.current.value

    if (creating === 'signIn') {
      handleSignIn(email)
      setCreating(undefined)
      setSnack({ open: true, message: 'Wellcome back!', status: 'success' })
    } else if (creating === 'signUp') {
      try {
        const user = await axios.post('/api/user', { email }).then((r) => r.data)
        if (user.success) {
          handleSignUp(email)
          setCreating(undefined)
          setSnack({ open: true, message: 'Account Created!', status: 'success' })
        } else {
          const response = await axios.post('/api/user/create', { email })
          if (response.data.success) {
            setEmail(email)
            setCreating('validate')
            setSnack({
              open: true,
              message: 'Review your mail inbox, a validation code has been sent!',
              status: 'info'
            })
          } else {
            setCreating(undefined)
          }
        }
      } catch (err) {
        setCreating(undefined)
        console.error('[handleAccess] ERROR =>', err)
      }
    }
  }, [creating, handleSignIn, handleSignUp])

  const handleSignOut = React.useCallback(async () => {
    const confirm = await Swal.fire({
      title: 'Sign Out',
      text: 'Are you leaving?',
      showCancelButton: true,
      showConfirmButton: true
    })
    if (confirm) {
      signOut()
      setSnack({ open: true, message: 'See you soon!', status: 'info' })
    }
  }, [signOut])

  const handleAddBackup = React.useCallback(async () => {
    if (!session?.user?.email) {
      throw new Error('Missing user session')
    }
    console.log('[handleAddBackup] user =>', session?.user?.email)
    const confirm = await Swal.fire({
      title: 'Account Login Backup',
      text: 'Add another device to log in this site',
      showCancelButton: true,
      showConfirmButton: true,
      icon: 'question'
    })
    if (confirm) {
      addBackup()
    }
  }, [session, addBackup])

  const handleExportKey = React.useCallback(() => {
    if (!session?.user?.id || !session?.user?.address) {
      throw new Error('Missing params')
    }
    console.log(session.user.address)
    const base64Key = localStorage.getItem(session.user.id)
    if (!base64Key) {
      return Swal.fire({
        title: 'Missing local wallet',
        text: 'There is no local wallet available',
        icon: 'error'
      })
    }

    const key = Buffer.from(base64Key, 'base64').toString()
    const blob = new Blob([key], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `airline-walley-key-${String(session.user.address).slice(-4)}.pem`

    // Append the <a> element to the document and trigger the click event
    document.body.appendChild(a)
    a.click()

    // Clean up the temporary URL object
    URL.revokeObjectURL(url)

    // Remove the <a> element from the document
    document.body.removeChild(a)
  }, [session?.user?.address, session?.user?.id])

  React.useEffect(() => {
    setSnack({ open: status === 'missingKey', message: 'Missing Key', status: 'error' })
    setSnack({ open: status === 'error', message: 'An error has occoured', status: 'error' })
  }, [status])

  return (
    <>
      <Snackbar
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        open={snack.open}
        autoHideDuration={6000}
        onClose={() => setSnack(initialSnackState)}
      >
        <Alert onClose={() => setSnack(initialSnackState)} severity={snack.status} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
      {!smartAccountAddress && (
        <>
          {(creating === 'signUp' || creating === 'signIn') && (
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
          )}
          {creating === 'validate' && (
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
          )}
          {!creating && (
            <>
              <Button
                disabled={status === 'loading'}
                variant='contained'
                color='secondary'
                onClick={() => {
                  setCreating('signIn')
                }}
              >
                Connect
              </Button>
              <Button
                disabled={status === 'loading'}
                variant='contained'
                onClick={() => {
                  setCreating('signUp')
                }}
              >
                Create
              </Button>
            </>
          )}
        </>
      )}
      {smartAccountAddress && (
        <div>
          <Button
            id='basic-button'
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            Dashboard
          </Button>
          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <MenuItem onClick={handleClose}>
              <Stack direction='row' spacing={2}>
                <Add />
                <Typography>Add Account Backup</Typography>
              </Stack>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Stack direction='row' spacing={2}>
                <Send />
                <Typography>Export Wallet</Typography>
              </Stack>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Stack direction='row' spacing={2}>
                <Logout />
                <Typography>Logout</Typography>
              </Stack>
            </MenuItem>
          </Menu>
        </div>
      )}
    </>
  )
}
