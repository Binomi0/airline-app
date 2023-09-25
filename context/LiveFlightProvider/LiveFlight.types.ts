import { ILive } from 'models/Live'
import { IvaoPilot } from 'types'

export type LiveFlightReducerState = {
  pilot?: Readonly<IvaoPilot>
  live?: Readonly<ILive> | null
}

export type LiveFlightContextProps = LiveFlightReducerState & {
  // eslint-disable-next-line no-unused-vars
  setPilot: (pilot?: Readonly<IvaoPilot>) => void
  getLive: () => Promise<void>
}

type SetPilot = Readonly<{
  type: 'SET_PILOT'
  payload?: Readonly<IvaoPilot>
}>

type Actions = SetPilot

// eslint-disable-next-line no-unused-vars
export type LiveFlightReducerHandler = (state: LiveFlightReducerState, action: Actions) => LiveFlightReducerState
