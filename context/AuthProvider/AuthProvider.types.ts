import { User } from 'types'

type Actions = SignIn | SignOut
type SignIn = Readonly<{ type: 'SIGN_IN'; payload?: User }>
type SignOut = Readonly<{ type: 'SIGN_OUT' }>

export type AuthReducerState = {
  user?: User
}

export type AuthContextProps = AuthReducerState & {
  signIn: () => void
  signOut: () => void
}

export type AuthReducerHandler = (state: AuthReducerState, action: Actions) => AuthReducerState
