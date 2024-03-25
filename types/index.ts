/* eslint-disable no-unused-vars */
import { NFT } from '@thirdweb-dev/sdk'
import { atc } from 'mocks'
import ivaoPilot from 'mocks/ivaoPilot'
import { VaUser } from 'models/User'

export interface AircraftAttributes {
  deposit: number
  cargo: number
  license: string
}

export interface AirlineNFT {
  metadata: {
    attributes: AircraftAttributes[]
    name: string
    description: string
    image: string
  }
}

export type LastTrackState = keyof typeof LastTrackStateEnum

// | 'En_Route'
// | 'Boarding'
// | 'Approach'
// | 'Departing'
// | 'On_Blocks'
// | 'Initial_Climb'
// | 'Landed'

export type IvaoPilot = typeof ivaoPilot

export interface FRoute {
  origin: string
  destination: string
}

export enum CargoStatus {
  STARTED = 'STARTED',
  COMPLETED = 'COMPLETED',
  ABORTED = 'ABORTED'
}
export type Flight = Record<string, FRoute[]>
export type Atc = typeof atc
export interface Cargo {
  // where it starts
  origin: string
  // where it finish
  destination: string
  // total distance in NM
  distance: number
  // Detailed info about cargo
  details: CargoDetail
  // selected aircraft nft data
  aircraft: NFT
  // selected aircraft id
  aircraftId: string
  // pilot callsign
  callsign: string
  weight: number
  prize: number
  status: CargoStatus
  remote: boolean
  rewards?: number
  isRewarded: boolean
  score?: number
}

export interface CargoDetail {
  name: string
  description: string
}

export interface CargoStep {
  name: string
  value: string
}

export enum Aircraft {
  C700 = '1',
  B737 = '2',
  C172 = '3',
  AN225 = '4'
}

export enum AircraftName {
  C700 = 'C700',
  B737 = 'B737',
  C172 = 'C172',
  AN225 = 'AN225'
}

export enum License {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

export type LicenseType = License.A | License.B | License.C | License.D

export type AttributeType = {
  trait_type: string
  value: string
}

export enum DB {
  develop = 'develop',
  production = 'production'
}

export enum Collection {
  user = 'user',
  cargo = 'cargo',
  live = 'live',
  wallet = 'wallet',
  webauthn = 'webauthn',
  transaction = 'transaction'
}

export interface User {
  id?: string
  email?: string
  address?: string
  vaUser?: VaUser
}

export interface Authenticator {
  credentialID: string
  credentialPublicKey: string
  counter: number
  transports?: string
}

export interface WebAuthnUser {
  email: string
  challenge: string
  authenticators: Authenticator[]
}

export enum WebAuthnUri {
  REQUEST_REGISTER = '/api/webauthn/request-register',
  REGISTER = '/api/webauthn/register',
  LOGIN = '/api/webauthn/login',
  LOGIN_CHALLENGE = '/api/webauthn/login-challenge'
}

export type AccountSignerStatus = 'loading' | 'error' | 'success' | 'missingKey' | undefined

export enum LastTrackStateEnum {
  En_Route = 'En Route',
  Boarding = 'Boarding',
  Approach = 'Approach',
  Departing = 'Departing',
  On_Blocks = 'On Blocks',
  Initial_Climb = 'Initial Climb',
  Landed = 'Landed'
}

export interface FlightState {
  name: LastTrackStateEnum
  value: Date
}

export interface PageProps {
  loading: boolean
}

export interface IvaoHours {
  type: string
  hours: number
}

export interface IvaoRating {
  isPilot: boolean
  isAtc: boolean
  pilotRating: IvaoPilotRating
  atcRating: IvaoPilotRating
  networkRating: IvaoPilotRating
}

export interface IvaoPilotRating {
  id: number
  name: string
  shortName: string
  description: string
}

export interface IvaoUser {
  id: number
  centerId: number
  countryId: string
  createdAt: string
  divisionId: string
  isStaff: boolean
  languageId: string
  email: string
  firstName: string
  lastName: string
  rating: IvaoRating
  hours: IvaoHours[]
  profile: string
  userStaffPositions: number[]
  ownedVirtualAirlines: number[]
  sub: 704763
  given_name: string
  family_name: string
  nickname: string
  publicNickname: string
}

export type IcaoCode =
  | 'AN225'
  | 'A20N'
  | 'A21N'
  | 'A319'
  | 'A320'
  | 'A321'
  | 'A339'
  | 'B350'
  | 'B748'
  | 'B738'
  | 'B739'
  | 'B737'
  | 'B763'
  | 'B77W'
  | 'B788'
  | 'C172'
  | 'C700'
  | 'BE20'
