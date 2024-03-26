import { User } from 'types'

type Actions = SignIn | SignOut
type SignIn = Readonly<{ type: 'SIGN_IN'; payload: AuthReducerState }>
type SignOut = Readonly<{ type: 'SIGN_OUT' }>

export type AuthReducerState = {
  user?: User
  token?: string
}

export type AuthContextProps = AuthReducerState & {
  signIn: (auth: AuthReducerState) => void
  signOut: () => void
}

export type AuthReducerHandler = (state: AuthReducerState, action: Actions) => AuthReducerState
