import React, { FC, useState, useEffect } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import StepIVAO from './components/StepIVAO'
import StepSmartAccount from './components/StepSmartAccount'
import StepPasskey from './components/StepPasskey'
import StepTutorial from './components/StepTutorial'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import { ivaoUserAuthStore } from 'store/ivaoUserAuth.atom'
import { useVaProviderContext } from 'context/VaProvider'
import { postApi } from 'lib/api'

const OnboardingView: FC = () => {
  const [step, setStep] = useState(0)
  const router = useRouter()
  const { initIvaoAuth, initIvaoData } = useVaProviderContext()
  const ivaoAuthToken = useRecoilValue(ivaoUserAuthStore)

  useEffect(() => {
    if (ivaoAuthToken === undefined) {
      initIvaoAuth()
      initIvaoData()
    }
  }, [ivaoAuthToken, initIvaoAuth, initIvaoData])

  const nextStep = () => setStep((s) => s + 1)
  const prevStep = () => setStep((s) => s - 1)

  const handleComplete = async () => {
    try {
      await postApi('/api/user/update', { onboarded: true })
      window.location.href = '/'
    } catch (err) {
      console.error('Failed to complete onboarding', err)
      // fallback just redirect
      window.location.href = '/'
    }
  }

  const renderStep = () => {
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
  }

  return (
    <Container maxWidth='sm'>
      <Box mt={8} p={4} bgcolor='background.paper' borderRadius={2} boxShadow={1}>
        {renderStep()}
      </Box>
    </Container>
  )
}

export default OnboardingView
