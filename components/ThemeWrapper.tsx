import React, { ReactNode } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { darkTheme, lightTheme } from '../src/theme'
import { useRecoilValue } from 'recoil'
import { themeStore } from 'store/theme.atom'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const colorSchemes = {
  colorSchemes: {
    light: lightTheme,
    dark: darkTheme
  }
}

interface Props {
  children: ReactNode
}

const ThemeWrapper = ({ children }: Props) => {
  const theme = useRecoilValue(themeStore)
  const extendedTheme = extendTheme(colorSchemes)

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline enableColorScheme />
      <CssVarsProvider defaultMode={theme} theme={extendedTheme} />

      {children}
    </ThemeProvider>
  )
}

export default ThemeWrapper
