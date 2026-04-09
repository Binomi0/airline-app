import React from 'react'
import dynamic from 'next/dynamic'
import { useTheme } from '@mui/material'

const GuideLoading = () => {
  const theme = useTheme()
  return (
    <div
      style={{
        height: '100vh',
        background: theme.palette.background.default,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.text.primary
      }}
    >
      Loading Guide...
    </div>
  )
}

const GuideView = dynamic(() => import('routes/guide/GuideView'), {
  ssr: false,
  loading: () => <GuideLoading />
})

const Guide = () => <GuideView />

export default Guide
