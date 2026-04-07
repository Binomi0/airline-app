import React, { ReactNode } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider } from '@mui/material/styles'
import { useRecoilValue } from 'recoil'
import { themeStore } from '@store/theme.atom'
import { useLeafletStyles } from '@hooks/useLeafletStyles'
import { getTheme } from '../src/theme'

interface Props {
  children: ReactNode
}

const ThemeWrapper = ({ children }: Props) => {
  const theme = useRecoilValue(themeStore)
  const currentTheme = getTheme(theme)
  const leafletStyles = useLeafletStyles(currentTheme)

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline enableColorScheme />
      <GlobalStyles
        styles={{
          '.radar-popup .leaflet-popup-content-wrapper': leafletStyles.popupWrapper,
          '.radar-popup .leaflet-popup-tip': leafletStyles.popupTip,
          '.radar-popup .leaflet-popup-content': leafletStyles.popupContent,
          '.radar-popup .leaflet-popup-close-button': leafletStyles.popupCloseButton,
          '.leaflet-tooltip': leafletStyles.tooltip,
          '.leaflet-tooltip-top:before': leafletStyles.tooltipBefore,
          '.leaflet-tooltip-bottom:before': leafletStyles.tooltipBefore,
          '.leaflet-tooltip-left:before': leafletStyles.tooltipBefore,
          '.leaflet-tooltip-right:before': leafletStyles.tooltipBefore
        }}
      />
      {children}
    </ThemeProvider>
  )
}

export default ThemeWrapper
