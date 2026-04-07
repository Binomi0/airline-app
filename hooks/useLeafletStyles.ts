import { useMemo } from 'react'
import { Theme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'

export const useLeafletStyles = (theme: Theme) => {
  return useMemo(
    () => ({
      popupWrapper: {
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        padding: '0',
        borderRadius: '12px',
        border: `1px solid ${alpha(theme.palette.common.black, 0.1)}`,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      },
      popupTip: {
        background: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.common.black, 0.1)}`
      },
      popupContent: {
        margin: '0',
        width: 'auto',
        padding: '16px',
        paddingRight: '32px'
      },
      popupCloseButton: {
        color: theme.palette.text.secondary,
        top: '8px',
        right: '8px',
        fontSize: '20px',
        zIndex: 1000
      },
      tooltip: {
        background: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.common.black, 0.1)}`,
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px ${alpha(theme.palette.common.black, 0.05)}`,
        color: theme.palette.text.primary,
        padding: '12px',
        borderRadius: '10px'
      },
      tooltipBefore: {
        borderTopColor: theme.palette.background.paper,
        borderBottomColor: theme.palette.background.paper,
        borderLeftColor: theme.palette.background.paper,
        borderRightColor: theme.palette.background.paper
      }
    }),
    [theme]
  )
}
