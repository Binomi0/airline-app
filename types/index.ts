/* eslint-disable no-unused-vars */
import { NFT } from '@thirdweb-dev/sdk'
import { atc } from 'mocks'
import ivaoPilot from 'mocks/ivaoPilot'
import { ObjectId } from 'mongodb'

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

export type LastTrackState =
  | 'En_Route'
  | 'Boarding'
  | 'Approach'
  | 'Departing'
  | 'On_Blocks'
  | 'Initial_Climb'
  | 'Landed'

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
  origin: string
  destination: string
  distance: number
  details: CargoDetail
  aircraft: NFT
  aircraftId: string
  callsign: string
  weight: number
  prize: number
  status: CargoStatus
  remote: boolean
  rewarded: boolean
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
