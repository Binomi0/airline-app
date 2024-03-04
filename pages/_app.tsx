import * as React from 'react'
import { AppProps } from 'next/app'
import { EmotionCache } from '@emotion/react'
import '../styles/globals.css'

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const { Component } = props

  return <Component />
}
