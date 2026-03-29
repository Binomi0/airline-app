import { Roboto, Sora, B612_Mono } from 'next/font/google'
import { createTheme, responsiveFontSizes, ThemeOptions, alpha } from '@mui/material/styles'
import { grey } from '@mui/material/colors'

export const AIRLINE_COLORS = {
  iberia: '#E81D2E',
  iberia_secondary: '#ffffff',
  vueling: '#FFD700',
  vueling_secondary: '#333333',
  ryanair: '#073590',
  ryanair_secondary: '#F1C933',
  ryanair_yellow: '#F1C400'
}

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
          background: theme.palette.mode === 'dark' ? theme.palette.common.black : theme.palette.common.white,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          boxShadow: `0 20px 25px -5px ${alpha(theme.palette.common.black, 0.5)}`,
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
      },
      {
        props: { variant: 'gasCard' },
        style: ({ theme }) => ({
          padding: theme.spacing(3),
          background: theme.palette.mode === 'dark' ? 'rgba(31, 41, 55, 0.4)' : 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(8px)',
          borderRadius: 16,
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
        })
      },
      {
        props: { variant: 'missionsCard' },
        style: ({ theme }) => ({
          padding: theme.spacing(2),
          background: theme.palette.mode === 'dark' ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
          borderRadius: theme.shape.borderRadius * 2,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: alpha(theme.palette.primary.main, 0.5),
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`
          }
        })
      },
      {
        props: { variant: 'dispatch' },
        style: ({ theme }) => ({
          padding: theme.spacing(3),
          borderRadius: theme.shape.borderRadius * 3,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`
        })
      },
      {
        props: { variant: 'showcaseImage' },
        style: ({ theme }) => ({
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 3',
          maxWidth: '500px',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: `0 20px 40px -15px ${alpha(theme.palette.common.black, 0.5)}, 0 0 30px ${alpha(theme.palette.primary.main, 0.1)}`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: alpha(theme.palette.background.paper, 0.02),
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          margin: '0 auto',
          '&:hover': {
            transform: 'translateY(-5px) scale(1.02)',
            borderColor: alpha(theme.palette.primary.main, 0.4),
            boxShadow: `0 30px 60px -20px ${alpha(theme.palette.common.black, 0.6)}, 0 0 40px ${alpha(theme.palette.primary.main, 0.2)}`
          }
        })
      }
    ]
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 600
      }
    },
    variants: [
      {
        props: { variant: 'premium' },
        style: ({ theme }) => ({
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: theme.palette.common.white,
          borderRadius: '12px',
          fontWeight: 700,
          textTransform: 'none',
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
          },
          '&:disabled': {
            background:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.text.primary, 0.05)
                : alpha(theme.palette.text.primary, 0.03),
            color: alpha(theme.palette.text.primary, 0.2),
            border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
            boxShadow: 'none'
          }
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
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(theme.palette.primary.main, 0.3)
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
          },
          '& .MuiFormHelperText-root': {
            position: 'absolute',
            bottom: -20,
            fontWeight: 'bold',
            fontSize: '0.65rem',
            margin: 0
          }
        })
      }
    ]
  },
  MuiTypography: {
    variants: [
      {
        props: { variant: 'h4' },
        style: {
          fontFamily: sora.style.fontFamily,
          letterSpacing: '-0.02em',
          fontWeight: 800
        }
      },
      {
        props: { variant: 'h5' },
        style: {
          fontFamily: sora.style.fontFamily,
          fontWeight: 700
        }
      },
      {
        props: { variant: 'h6' },
        style: {
          fontFamily: sora.style.fontFamily,
          fontWeight: 700
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
    missionsCard: true
    dispatch: true
    terminal: true
    glass: true
    license: true
    licenseActive: true
    gasCard: true
    showcaseImage: true
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    premium: true
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    indigo: Palette['primary']
    violet: Palette['primary']
    slate: Palette['primary']
    ivao: {
      hq_event: string
      rfe: string
      pde: string
      generic: string
    }
    purple: Palette['primary']
    pink: Palette['primary']
    sky: Palette['primary']
    amber: Palette['primary']
    airlines: {
      iberia: string
      vueling: string
      ryanair: string
      ryanair_yellow: string
    }
    weifly: {
      home: {
        hero: {
          from: string
          mid: string
          to: string
        }
      }
      crowdfunding: {
        bg: {
          from: string
          to: string
        }
        primary: string
        secondary: string
        accent: string
        glass: {
          bg: string
          border: string
        }
        nav: string
      }
      legal: {
        bg: string
        overlay: {
          from: string
          to: string
        }
        glass: {
          bg: string
        }
      }
      launchpad: {
        bg: string
        hero: {
          from: string
          to: string
        }
        primary: string
        primaryHover: string
        accent: string
        glass: {
          bg: string
          border: string
        }
        nav: string
        card: string
      }
      status: {
        live: string
      }
    }
  }
  interface PaletteOptions {
    indigo?: PaletteOptions['primary']
    violet?: PaletteOptions['primary']
    slate?: PaletteOptions['primary']
    ivao?: {
      hq_event?: string
      rfe?: string
      pde?: string
      generic?: string
    }
    purple?: PaletteOptions['primary']
    pink?: PaletteOptions['primary']
    sky?: PaletteOptions['primary']
    amber?: PaletteOptions['primary']
    airlines?: {
      iberia?: string
      vueling?: string
      ryanair?: string
      ryanair_yellow?: string
    }
    weifly?: {
      home?: {
        hero?: {
          from?: string
          mid?: string
          to?: string
        }
      }
      crowdfunding?: {
        bg?: {
          from?: string
          to?: string
        }
        primary?: string
        secondary?: string
        accent?: string
        glass?: {
          bg?: string
          border?: string
        }
        nav?: string
      }
      legal?: {
        bg?: string
        overlay?: {
          from?: string
          to?: string
        }
        glass?: {
          bg?: string
        }
      }
      launchpad?: {
        bg?: string
        hero?: {
          from?: string
          to?: string
        }
        primary?: string
        primaryHover?: string
        accent?: string
        glass?: {
          bg?: string
          border?: string
        }
        nav?: string
        card?: string
      }
      status?: {
        live?: string
      }
    }
  }
}

// Create a theme instance.
const lTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3B82F6',
      light: '#60a5fa',
      dark: '#2563eb'
    },
    secondary: {
      main: '#10B981',
      light: '#34d399',
      dark: '#059669'
    },
    success: {
      main: '#10B981',
      light: '#4ade80',
      dark: '#059669'
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626'
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706'
    },
    info: {
      main: '#3b82f6',
      light: '#38bdf8',
      dark: '#1d4ed8'
    },
    background: {
      default: '#F3F4F6',
      paper: '#FFFFFF'
    },
    indigo: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5'
    },
    violet: {
      main: '#a855f7',
      light: '#c084fc',
      dark: '#9333ea'
    },
    slate: {
      main: '#1e293b',
      light: '#64748b',
      dark: '#0f172a'
    },
    ivao: {
      hq_event: '#ff4081',
      rfe: '#7c4dff',
      pde: '#00e676',
      generic: '#2196f3'
    },
    amber: {
      main: '#F59E0B',
      light: '#fbbf24',
      dark: '#d97706'
    },
    sky: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0284c7'
    },
    purple: {
      main: '#8B5CF6',
      light: '#a78bfa',
      dark: '#7c3aed'
    },
    pink: {
      main: '#EC4899',
      light: '#f472b6',
      dark: '#db2777'
    },
    airlines: {
      iberia: AIRLINE_COLORS.iberia,
      vueling: AIRLINE_COLORS.vueling,
      ryanair: AIRLINE_COLORS.ryanair,
      ryanair_yellow: AIRLINE_COLORS.ryanair_yellow
    },
    weifly: {
      home: {
        hero: {
          from: '#312e81',
          mid: '#4f46e5',
          to: '#6366f1'
        }
      },
      crowdfunding: {
        bg: {
          from: '#0a0f1f',
          to: '#1a1f35'
        },
        primary: '#0a1e3c',
        secondary: '#2a7de1',
        accent: '#ff6b35',
        glass: {
          bg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)'
        },
        nav: 'rgba(10, 15, 31, 0.8)'
      },
      legal: {
        bg: '#f8fafc',
        overlay: {
          from: 'rgba(241, 245, 249, 0.95)',
          to: 'rgba(226, 232, 240, 0.9)'
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.7)'
        }
      },
      launchpad: {
        bg: '#f8fafc',
        hero: {
          from: '#fff',
          to: '#94a3b8'
        },
        primary: '#3B82F6',
        primaryHover: '#2563eb',
        accent: '#ff6b35',
        glass: {
          bg: 'rgba(255, 255, 255, 0.7)',
          border: 'rgba(0, 0, 0, 0.1)'
        },
        nav: 'rgba(255, 255, 255, 0.8)',
        card: '#ffffff'
      },
      status: {
        live: '#10b981'
      }
    }
  },
  typography: commonTypography,
  components: {
    ...commonComponents,
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(12px)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
          color: theme.palette.slate.main,
          borderRadius: 0
        })
      }
    }
  }
})

// Need to define Theme type for casting since it's recursive otherwise

const dTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3B82F6',
      light: '#60a5fa',
      dark: '#2563eb'
    },
    secondary: {
      main: '#10B981',
      light: '#34d399',
      dark: '#059669'
    },
    success: {
      main: '#10B981',
      light: '#4ade80',
      dark: '#059669'
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626'
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706'
    },
    info: {
      main: '#3b82f6',
      light: '#38bdf8',
      dark: '#1d4ed8'
    },
    background: {
      default: '#0B0F19',
      paper: '#111827'
    },
    grey,
    indigo: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5'
    },
    violet: {
      main: '#a855f7',
      light: '#c084fc',
      dark: '#9333ea'
    },
    slate: {
      main: '#1e293b',
      light: '#64748b',
      dark: '#0f172a'
    },
    ivao: {
      hq_event: '#ff4081',
      rfe: '#7c4dff',
      pde: '#00e676',
      generic: '#2196f3'
    },
    amber: {
      main: '#F59E0B',
      light: '#fbbf24',
      dark: '#d97706'
    },
    sky: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0284c7'
    },
    purple: {
      main: '#8B5CF6',
      light: '#a78bfa',
      dark: '#7c3aed'
    },
    pink: {
      main: '#EC4899',
      light: '#f472b6',
      dark: '#db2777'
    },
    airlines: {
      iberia: AIRLINE_COLORS.iberia,
      vueling: AIRLINE_COLORS.vueling,
      ryanair: AIRLINE_COLORS.ryanair,
      ryanair_yellow: AIRLINE_COLORS.ryanair_yellow
    },
    weifly: {
      home: {
        hero: {
          from: '#e0e7ff',
          mid: '#a5b4fc',
          to: '#818cf8'
        }
      },
      crowdfunding: {
        bg: {
          from: '#0a0f1f',
          to: '#1a1f35'
        },
        primary: '#0a1e3c',
        secondary: '#2a7de1',
        accent: '#ff6b35',
        glass: {
          bg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)'
        },
        nav: 'rgba(10, 15, 31, 0.8)'
      },
      legal: {
        bg: '#0b0f19',
        overlay: {
          from: 'rgba(15, 23, 42, 0.95)',
          to: 'rgba(30, 41, 59, 0.9)'
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.03)'
        }
      },
      launchpad: {
        bg: '#0b0f19',
        hero: {
          from: '#fff',
          to: '#94a3b8'
        },
        primary: '#3B82F6',
        primaryHover: '#2563eb',
        accent: '#ff6b35',
        glass: {
          bg: 'rgba(17, 24, 39, 0.4)',
          border: 'rgba(255, 255, 255, 0.1)'
        },
        nav: 'rgba(11, 15, 25, 0.8)',
        card: '#111827'
      },
      status: {
        live: '#10b981'
      }
    }
  },
  typography: commonTypography,
  components: {
    ...commonComponents,
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: alpha(theme.palette.background.default, 0.7),
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          color: theme.palette.common.white,
          borderRadius: 0
        })
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
