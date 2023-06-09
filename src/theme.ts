import { Roboto } from 'next/font/google'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import { red } from '@mui/material/colors'

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif']
})
// Create a theme instance.
let theme = createTheme({
  palette: {
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
    fontFamily: 'Roboto',
    allVariants: {
      fontFamily: 'Roboto'
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

theme = responsiveFontSizes(theme)

export default theme
