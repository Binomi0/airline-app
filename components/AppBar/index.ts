import AppBar from './AppBar'

export type UserActionStatus = 'signIn' | 'signUp' | 'code' | undefined

export type AppBarSnackStatus = 'success' | 'error' | 'warning' | 'info'

export interface AppBarSnack {
  open: boolean
  message: string
  status: AppBarSnackStatus
}

export default AppBar
