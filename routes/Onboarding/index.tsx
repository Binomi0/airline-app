import React, { FC, useState, useEffect, useCallback } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import StepIVAO from './components/StepIVAO'
import StepSmartAccount from './components/StepSmartAccount'
import StepPasskey from './components/StepPasskey'
import StepTutorial from './components/StepTutorial'
import { useRecoilValue } from 'recoil'
import { ivaoUserAuthStore } from 'store/ivaoUserAuth.atom'
import { useVaProviderContext } from 'context/VaProvider'
import { postApi } from 'lib/api'
import { Typography } from 'material'
import { IUser } from 'models/User'
import { useRouter } from 'next/router'

const STORAGE_KEY = 'onboarding_step'

const OnboardingView: FC = () => {
  const router = useRouter()
  const [step, setStep] = useState(() => {
    // Persistir el paso en localStorage
    const savedStep = localStorage.getItem(STORAGE_KEY)
    return savedStep ? parseInt(savedStep) : 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { initIvaoAuth, initIvaoData, isLoading: vaLoading } = useVaProviderContext()
  const ivaoAuthToken = useRecoilValue(ivaoUserAuthStore)

  // Guardar paso actual
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, step.toString())
  }, [step])

  // Inicialización mejorada
  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Solo inicializar si no hay token y no está inicializado
        if (!ivaoAuthToken && !vaLoading) {
          await Promise.all([initIvaoAuth(), initIvaoData()])
        }
      } catch (err) {
        console.error('Failed to initialize IVAO data', err)
        setError('Failed to connect to IVAO. Please refresh the page.')
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initialize()

    return () => {
      mounted = false
    }
  }, [ivaoAuthToken, initIvaoAuth, initIvaoData, vaLoading])

  const nextStep = useCallback(() => {
    setStep((s) => s + 1)
  }, [])

  const prevStep = useCallback(() => {
    setStep((s) => s - 1)
  }, [])

  const handleComplete = useCallback(async () => {
    try {
      setError(null)
      const response = await postApi<IUser>('/api/user/update', { onboarded: true })

      if (response?.onboarded) {
        // Limpiar storage al completar
        localStorage.removeItem(STORAGE_KEY)
        router.push('/')
      } else {
        throw new Error('Failed to update onboarding status')
      }
    } catch (err) {
      console.error('Failed to complete onboarding', err)
      setError('Failed to complete onboarding. Please try again or contact support.')
      // No redirigir automáticamente en caso de error
    }
  }, [])

  const renderStep = useCallback(() => {
    switch (step) {
      case 0:
        return <StepIVAO onNext={nextStep} />
      case 1:
        return <StepSmartAccount onNext={nextStep} onBack={prevStep} />
      case 2:
        return <StepPasskey onNext={nextStep} onBack={prevStep} />
      case 3:
        return <StepTutorial onComplete={handleComplete} onBack={prevStep} />
      default:
        return <StepIVAO onNext={nextStep} />
    }
  }, [step, nextStep, prevStep, handleComplete])

  if (isLoading) {
    return (
      <Container maxWidth='sm'>
        <Box mt={8} p={4} bgcolor='background.paper' borderRadius={2} boxShadow={1} textAlign='center'>
          <CircularProgress />
          <Typography mt={2}>Loading your account information...</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth='sm'>
      <Box mt={8} p={4} bgcolor='background.paper' borderRadius={2} boxShadow={1}>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {renderStep()}
      </Box>
    </Container>
  )
}

export default OnboardingView
