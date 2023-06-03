import { NFT } from '@thirdweb-dev/sdk'
import { atc } from 'mocks'
import ivaoPilot from 'mocks/ivaoPilot'

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
  | 'En Route'
  | 'Boarding'
  | 'Approach'
  | 'Departing'
  | 'On Blocks'
  | 'Initial Climb'
  | 'Landed'

export type IvaoPilot = typeof ivaoPilot

export interface FRoute {
  origin: string
  destination: string
}

export type Flight = Record<string, FRoute[]>
export type Atc = typeof atc
export interface Cargo {
  origin: string
  destination: string
  distance: number
  details: CargoDetails
  aircraft: NFT
  aircraftId: string
  weight: number
  callsign: string
  prize: number
}

export interface CargoDetails {
  name: string
  description: string
}

export enum Aircraft {
  C700 = '1',
  B737 = '2',
  C172 = '3',
  AN225 = '4'
}

export enum AircraftName {
  'C700',
  'B737',
  'C172',
  'AN225'
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
