import { Atc, Flight, IvaoPilot } from 'types'

export type VaReducerState = {
  pilots: Readonly<IvaoPilot[]>
  atcs: Readonly<Atc[]>
  towers: Readonly<Atc[]>
  active?: IvaoPilot
  flights?: Flight
  origins: string[]
  filter: string[]
}

export type VaContextProps = VaReducerState & {
  setCurrentPilot: (pilot?: Readonly<IvaoPilot>) => void
  setFilter: (value: string) => void
}

export type IVAOClients = VaReducerState

type SetPilots = Readonly<{
  type: 'SET_PILOTS'
  payload: Readonly<IvaoPilot[]>
}>
type SetCurrentPilot = Readonly<{
  type: 'SET_CURRENT_PILOT'
  payload?: Readonly<IvaoPilot>
}>
type SetFlights = Readonly<{
  type: 'SET_FLIGHTS'
  payload?: Readonly<Flight>
}>
type SetAtcs = Readonly<{
  type: 'SET_ATCS'
  payload: Readonly<Atc[]>
}>
type SetFilter = Readonly<{
  type: 'SET_FILTER'
  payload: Readonly<string>
}>
type SetTowers = Readonly<{
  type: 'SET_TOWERS'
  payload: Readonly<Atc[]>
}>

type Actions = SetPilots | SetCurrentPilot | SetFlights | SetFilter | SetAtcs | SetTowers

export type VaReducerHandler = (state: VaReducerState, action: Actions) => VaReducerState
