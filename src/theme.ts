import { Roboto, Sora } from 'next/font/google'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import { red } from '@mui/material/colors'

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif']
})
export const sora = Sora({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif']
})
// Create a theme instance.
const lTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#556cd6'
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: red.A400
    },
    background: {
      // default: '#0f1318',
      // paper: '#0f1318'
    }
  },
  typography: {
    fontFamily: 'Sora',
    allVariants: {
      fontFamily: 'Sora'
    },
    h1: {
      textShadow: '2px 2px 10px grey',
      fontWeight: 700
    },
    h2: {
      fontWeight: 500
    },
    body1: {
      fontWeight: 300
    },
    body2: {
      fontWeight: 500
    }
  }
})

const dTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#556cd6'
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: red.A400
    }
  },
  typography: {
    fontFamily: 'Sora',
    allVariants: {
      fontFamily: 'Sora'
    },
    h1: {
      textShadow: '2px 2px 10px grey',
      fontWeight: 700
    },
    h2: {
      fontWeight: 500
    },
    body1: {
      fontWeight: 300
    },
    body2: {
      fontWeight: 500
    }
  }
})

export const darkTheme = responsiveFontSizes(dTheme)
export const lightTheme = responsiveFontSizes(lTheme)

export default darkTheme
