import React, { FC, useState, useCallback, useMemo } from 'react'
import { Stack, Box, Typography, Button, CircularProgress, Fade, Container } from '@mui/material'
import Image from 'next/image'
import LockIcon from '@mui/icons-material/Lock'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import useAuth from 'hooks/useAuth'
import EmailInput from './components/EmailInput'
import CodeInput from 'components/AppBar/components/CodeInput'
import { validateEmail } from 'utils'
import { postApi } from 'lib/api'
import styles from './login.module.css'

type AuthMode = 'initial' | 'signin' | 'signup' | 'verify'

const LoginView: FC = () => {
  const [mode, setMode] = useState<AuthMode>('initial')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { handleSignIn, handleSignUp } = useAuth()

  const handleSignInFlow = useCallback(
    async (value: string) => {
      setLoading(true)
      try {
        await handleSignIn(value)
      } catch (error) {
        console.error('Login failed', error)
      } finally {
        setLoading(false)
      }
    },
    [handleSignIn]
  )

  const handleSignUpInit = useCallback(async (value: string) => {
    if (!validateEmail(value)) return
    setLoading(true)
    try {
      const check = await postApi<{ success: boolean; emailVerified?: boolean }>('/api/user/check', { email: value })
      if (check?.success && check?.emailVerified) {
        const create = await postApi<{ success: boolean }>('/api/user/create', { email: value })
        if (create?.success) {
          setEmail(value)
          setMode('verify')
        }
        return
      }
      const create = await postApi<{ success: boolean }>('/api/user/create', { email: value })
      if (create?.success) {
        setEmail(value)
        setMode('verify')
      }
    } catch (error) {
      console.error('Signup init failed', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleVerifyCode = useCallback(
    async (code: string) => {
      setLoading(true)
      try {
        await postApi('/api/user/validate', { code, email })
        await handleSignUp(email)
      } catch (error) {
        console.error('Verification failed', error)
      } finally {
        setLoading(false)
      }
    },
    [email, handleSignUp]
  )

  const renderContent = useMemo(() => {
    if (loading) {
      return (
        <Stack alignItems='center' py={4}>
          <CircularProgress size={48} thickness={4} />
          <Typography mt={3} variant='h6' color='text.secondary'>
            Procesando...
          </Typography>
        </Stack>
      )
    }

    switch (mode) {
      case 'initial':
        return (
          <Fade in timeout={500}>
            <Stack spacing={3} alignItems='center'>
              <Typography variant='h4' className={styles.mainTitle} align='center' gutterBottom>
                Eleva tu Trayecto
              </Typography>
              <Typography variant='body1' align='center' color='text.secondary' sx={{ mb: 2 }}>
                Inicia sesión en tu cuenta de Aerolínea Virtual o crea una nueva para empezar a volar.
              </Typography>
              <Button
                fullWidth
                variant='contained'
                size='large'
                className={styles.primaryButton}
                onClick={() => setMode('signin')}
              >
                Inicia Sesión con Passkey
              </Button>
              <Button
                fullWidth
                variant='outlined'
                size='large'
                className={styles.secondaryButton}
                onClick={() => setMode('signup')}
              >
                Crear Nueva Cuenta
              </Button>
            </Stack>
          </Fade>
        )
      case 'signin':
        return (
          <Fade in timeout={500}>
            <Stack spacing={3}>
              <Stack direction='row' alignItems='center' spacing={1} mb={1}>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => setMode('initial')}
                  sx={{ minWidth: 0, p: 0 }}
                  color='inherit'
                />
                <Typography variant='h5' fontWeight={600}>
                  Iniciar Sesión
                </Typography>
              </Stack>
              <Typography variant='body2' color='text.secondary'>
                Introduce tu correo. Tu navegador te pedirá tu Passkey.
              </Typography>
              <Box className={styles.inputWrapper}>
                <EmailInput
                  color='primary'
                  onCancel={() => setMode('initial')}
                  onSubmit={handleSignInFlow}
                  loading={false}
                />
              </Box>
            </Stack>
          </Fade>
        )
      case 'signup':
        return (
          <Fade in timeout={500}>
            <Stack spacing={3}>
              <Stack direction='row' alignItems='center' spacing={1} mb={1}>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => setMode('initial')}
                  sx={{ minWidth: 0, p: 0 }}
                  color='inherit'
                />
                <Typography variant='h5' fontWeight={600}>
                  Únete a WeiFly
                </Typography>
              </Stack>
              <Typography variant='body2' color='text.secondary'>
                Comienza hoy tu carrera en la aviación descentralizada.
              </Typography>
              <Box className={styles.inputWrapper}>
                <EmailInput
                  color='primary'
                  onCancel={() => setMode('initial')}
                  onSubmit={handleSignUpInit}
                  loading={false}
                />
              </Box>
            </Stack>
          </Fade>
        )
      case 'verify':
        return (
          <Fade in timeout={500}>
            <Stack spacing={3}>
              <Typography variant='h5' fontWeight={600} align='center'>
                Verificar Correo
              </Typography>
              <Typography variant='body2' color='text.secondary' align='center'>
                Hemos enviado un código a <strong>{email}</strong>. Al introducirlo verificarás tu cuenta y podrás crear
                tu passkey.
              </Typography>
              <Box className={styles.inputWrapper}>
                <CodeInput onCancel={() => setMode('signup')} onSubmit={handleVerifyCode} loading={false} />
              </Box>
            </Stack>
          </Fade>
        )
      default:
        return null
    }
  }, [mode, loading, email, handleSignInFlow, handleSignUpInit, handleVerifyCode])

  return (
    <Box className={styles.pageContainer}>
      <div className={styles.backgroundOverlay} />
      <Container maxWidth='sm' className={styles.container}>
        <Box className={styles.glassCard}>
          <Stack spacing={4} alignItems='center' width='100%'>
            <Box className={styles.logoWrapper}>
              <Image priority src='/logo64x64-white.png' alt='WeiFly Logo' width={80} height={80} />
            </Box>

            <Box width='100%'>{renderContent}</Box>

            <Stack direction='row' alignItems='center' spacing={1} className={styles.footerNote}>
              <LockIcon fontSize='small' sx={{ opacity: 0.5 }} />
              <Typography variant='caption'>Autenticación segura mediante WebAuthn Passkeys.</Typography>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}

export default LoginView
