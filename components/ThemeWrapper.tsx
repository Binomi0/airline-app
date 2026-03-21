import React, { ReactNode } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider, Experimental_CssVarsProvider as CssVarsProvider, useColorScheme, experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { darkTheme, lightTheme } from '../src/theme'
import { useRecoilValue } from 'recoil'
import { themeStore } from 'store/theme.atom'

const colorSchemes = {
  colorSchemes: {
    light: lightTheme,
    dark: darkTheme
  }
}

interface Props {
  children: ReactNode
}

const ThemeSync = () => {
  const theme = useRecoilValue(themeStore)
  const { setMode } = useColorScheme()

  React.useEffect(() => {
    if (setMode) {
      setMode(theme)
    }
  }, [theme, setMode])

  return null
}

const ThemeWrapper = ({ children }: Props) => {
  const theme = useRecoilValue(themeStore)
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme
  const extendedTheme = extendTheme(colorSchemes)

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline enableColorScheme />
      <GlobalStyles
        styles={{
          '.radar-popup .leaflet-popup-content-wrapper': {
            background: `${currentTheme.palette.mode === 'dark' ? '#0f172a' : '#fff'} !important`,
            color: `${currentTheme.palette.text.primary} !important`,
            padding: '0 !important',
            borderRadius: '12px !important',
            border: `1px solid ${currentTheme.palette.mode === 'dark' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(0,0,0,0.1)'} !important`,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important'
          },
          '.radar-popup .leaflet-popup-tip': {
            background: `${currentTheme.palette.mode === 'dark' ? '#0f172a' : '#fff'} !important`,
            border: `1px solid ${currentTheme.palette.mode === 'dark' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(0,0,0,0.1)'} !important`
          },
          '.radar-popup .leaflet-popup-content': {
            margin: '0 !important',
            width: 'auto !important',
            padding: '16px !important',
            paddingRight: '32px !important'
          },
          '.radar-popup .leaflet-popup-close-button': {
            color: `${currentTheme.palette.text.secondary} !important`,
            top: '8px !important',
            right: '8px !important',
            fontSize: '20px !important',
            zIndex: 1000
          },
          '.leaflet-tooltip': {
            background: `${currentTheme.palette.mode === 'dark' ? '#0f172a' : '#fff'} !important`,
            border: `1px solid ${currentTheme.palette.mode === 'dark' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(0,0,0,0.1)'} !important`,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1) !important',
            color: `${currentTheme.palette.text.primary} !important`,
            padding: '8px !important',
            borderRadius: '8px !important'
          },
          '.leaflet-tooltip-top:before': {
            borderTopColor: `${currentTheme.palette.mode === 'dark' ? '#0f172a' : '#fff'} !important`
          },
          '.leaflet-tooltip-bottom:before': {
            borderBottomColor: `${currentTheme.palette.mode === 'dark' ? '#0f172a' : '#fff'} !important`
          },
          '.leaflet-tooltip-left:before': {
            borderLeftColor: `${currentTheme.palette.mode === 'dark' ? '#0f172a' : '#fff'} !important`
          },
          '.leaflet-tooltip-right:before': {
            borderRightColor: `${currentTheme.palette.mode === 'dark' ? '#0f172a' : '#fff'} !important`
          }
        }}
      />
      <CssVarsProvider defaultMode={theme} theme={extendedTheme}>
        <ThemeSync />
        {children}
      </CssVarsProvider>
    </ThemeProvider>
  )
}

export default ThemeWrapper
