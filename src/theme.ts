import { Roboto, Sora, B612_Mono } from 'next/font/google'
import { createTheme, responsiveFontSizes, ThemeOptions, alpha } from '@mui/material/styles'
import { grey, red } from '@mui/material/colors'

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif']
})
export const sora = Sora({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif']
})

export const b612Mono = B612_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap'
})

const commonTypography: ThemeOptions['typography'] = {
  fontFamily: 'Sora, sans-serif',
  allVariants: {
    fontFamily: 'Sora, sans-serif'
  },
  h1: {
    fontWeight: 700
  },
  h2: {
    fontWeight: 600
  },
  h3: {
    fontWeight: 600
  },
  h4: {
    fontWeight: 600
  },
  h5: {
    fontWeight: 600
  },
  h6: {
    fontWeight: 600
  },
  body1: {
    fontWeight: 400
  },
  body2: {
    fontWeight: 500
  },
  button: {
    textTransform: 'none',
    fontWeight: 600
  }
}

const commonComponents: ThemeOptions['components'] = {
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRadius: 0,
        border: 'none',
        backgroundImage: 'none'
      }
    }
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 600
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
      }
    }
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: '12px'
      }
    },
    variants: [
      {
        props: { variant: 'terminal' },
        style: ({ theme }) => ({
          background: '#000',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.5)`,
          padding: theme.spacing(2)
        })
      },
      {
        props: { variant: 'glass' },
        style: ({ theme }) => ({
          background: theme.palette.mode === 'dark' ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)'
        })
      },
      {
        props: { variant: 'license' },
        style: ({ theme }) => ({
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: theme.spacing(2),
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(1.5),
          cursor: 'pointer',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.05)',
            transform: 'translateY(-5px)',
            borderColor: 'rgba(255, 255, 255, 0.2)'
          }
        })
      },
      {
        props: { variant: 'licenseActive' },
        style: ({ theme }) => ({
          background: `${alpha(theme.palette.primary.main, 0.1)}`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${theme.palette.primary.main}`,
          borderRadius: '16px',
          padding: theme.spacing(2),
          boxShadow: `0 0 25px ${alpha(theme.palette.primary.main, 0.15)}`,
          transform: 'translateY(-5px)',
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(1.5),
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        })
      }
    ]
  },
  MuiTextField: {
    variants: [
      {
        props: { variant: 'outlined', color: 'primary' },
        style: ({ theme }) => ({
          '& .MuiOutlinedInput-root': {
            height: 32,
            fontFamily: b612Mono.style.fontFamily,
            fontSize: '1rem',
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            '& fieldset': {
              borderColor: alpha(theme.palette.primary.main, 0.2)
            },
            '&:hover fieldset': {
              borderColor: alpha(theme.palette.primary.main, 0.4)
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main
            }
          },
          '& .MuiInputBase-input::placeholder': {
            color: alpha(theme.palette.primary.main, 0.5),
            opacity: 1
          }
        })
      }
    ]
  },
  MuiTypography: {
    variants: [
      {
        props: { variant: 'h4' }, // Apply to h4 if it's used for headers
        style: {
          fontFamily: b612Mono.style.fontFamily
        }
      },
      {
        props: { variant: 'button' },
        style: {
          fontFamily: sora.style.fontFamily
        }
      }
    ]
  }
}

// Module augmentation for custom variants
declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    terminal: true
    glass: true
    license: true
    licenseActive: true
  }
}

// Create a theme instance.
const lTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3B82F6'
    },
    secondary: {
      main: '#10B981'
    },
    error: {
      main: red.A400
    },
    background: {
      default: '#F3F4F6',
      paper: '#FFFFFF'
    }
  },
  typography: commonTypography,
  components: {
    ...commonComponents,
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          color: '#1e293b',
          borderRadius: 0
        }
      }
    }
  }
})

const dTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3B82F6'
    },
    secondary: {
      main: '#10B981'
    },
    error: {
      main: red.A400
    },
    background: {
      default: '#0B0F19',
      paper: '#111827'
    },
    grey
  },
  typography: commonTypography,
  components: {
    ...commonComponents,
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(11, 15, 25, 0.7)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          color: '#fff',
          borderRadius: 0
        }
      }
    }
  }
})

// @ts-expect-error - Custom property for AppBar
dTheme.palette.AppBar = { darkBg: 'rgba(11, 15, 25, 0.7)' }

export const darkTheme = responsiveFontSizes(dTheme)
export const lightTheme = responsiveFontSizes(lTheme)

const theme = {
  darkTheme,
  lightTheme
}
export default theme
