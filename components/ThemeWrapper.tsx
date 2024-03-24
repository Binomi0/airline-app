import React, { ReactNode } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { darkTheme, lightTheme } from '../src/theme'
import { useRecoilValue } from 'recoil'
import { themeStore } from 'store/theme.atom'

interface Props {
  children: ReactNode
}

const ThemeWrapper = ({ children }: Props) => {
  const theme = useRecoilValue(themeStore)

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  )
}

export default ThemeWrapper
