import { NFT } from 'thirdweb'
import nextApiInstance from 'config/axios'
import {
  ActiveAtc,
  Airport,
  AtcPosition,
  AttributeType,
  IcaoCode,
  IvaoPilot,
  TowerMatrix,
  TowerMatrixList,
  aircraftNameToIcaoCode
} from 'types'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'

// A unique identifier for your website
const rpID = process.env.NEXT_PUBLIC_DOMAIN
// The URL at which registrations and authentications should occur
const origin = process.env.ORIGIN

// @ts-ignore
export const verifySignature = async function (authenticator, response, expectedChallenge) {
  const bufferFromBase64 = (buffer: string) => Buffer.from(buffer, 'base64')
  const credentialIDBuffer = bufferFromBase64(authenticator.credentialID)
  const credentialPublicKeyBuffer = bufferFromBase64(authenticator.credentialPublicKey)

  try {
    await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        ...authenticator,
        credentialID: new Uint8Array(
          credentialIDBuffer.buffer,
          credentialIDBuffer.byteOffset,
          credentialIDBuffer.byteLength / Uint8Array.BYTES_PER_ELEMENT
        ),
        credentialPublicKey: new Uint8Array(
          credentialPublicKeyBuffer.buffer,
          credentialPublicKeyBuffer.byteOffset,
          credentialPublicKeyBuffer.byteLength / Uint8Array.BYTES_PER_ELEMENT
        )
      }
    })

    return true
  } catch (error) {
    console.error(error)

    return false
    // return res.status(400).send({ error: error.message, verified: false });
  }
}

export const getNFTAttributes = (nft: NFT) => {
  if (nft.metadata.attributes && Array.isArray(nft.metadata.attributes) && nft.metadata.attributes.length > 0) {
    return nft.metadata.attributes as AttributeType[]
  }

  return []
}

export const parseNumber = (value: number | bigint) => Intl.NumberFormat('es').format(value)

export const formatNumber = (value: number = 0, decimals: number = 2) =>
  Intl.NumberFormat('es', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(isNaN(value) ? 0 : value)

export const getDistanceByCoords = (
  origin: AtcPosition['atcPosition']['airport'],
  destination: AtcPosition['atcPosition']['airport']
) => {
  if (!origin || !destination) return 0

  const horizontal = Math.pow(Number(destination.longitude) - Number(origin.longitude), 2)
  const vertical = Math.pow(Number(destination.latitude) - Number(origin.latitude), 2)
  const result = Math.sqrt(horizontal + vertical)

  return result * 100
}

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min) / 100
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export function getCallsign() {
  const ident = Math.round(Math.floor(Math.random() * (10000 - 1000 + 1) + 1000))
  return `${process.env.NEXT_PUBLIC_CALLSIGN}${ident}`
}

export function getCargoWeight(aircraft: NFT) {
  const attribute = getNFTAttributes(aircraft).find((attribute) => attribute.trait_type === 'cargo')

  if (!attribute) {
    console.warn(`Aircraft ${aircraft.id} is missing 'cargo' attribute`)
    return 0
  }

  return Number(attribute.value) * randomIntFromInterval(40, 70) || 0
}

export function getCargoPrize(distance: number, aircraft: NFT) {
  const attribute = getNFTAttributes(aircraft).find((attr) => attr.trait_type === 'license')
  if (attribute) {
    const base = Math.floor(distance / 100) / 5
    switch (attribute.value) {
      case '0': // 'D'
        return base * (1 + randomIntFromInterval(35, 75))
      case '1': // 'C
        return base * (1 + randomIntFromInterval(55, 65) * 1.2)
      case '2': // 'B'
        return base * (1 + randomIntFromInterval(65, 75) * 1.3)
      case '3': // 'A'
        return base * (1 + randomIntFromInterval(75, 95) * 1.5)
      default:
        return base * (1 + randomIntFromInterval(35, 75))
    }
  }
  console.warn(`Aircraft ${aircraft.id} is missing 'license' attribute`)
  return 0
}

export const getLicenseIdFromAttributes = (attributes: AttributeType[]) =>
  attributes.find((attribute) => attribute.trait_type === 'license')?.value || ''

export const filterLEOrigins = (pilot: IvaoPilot) => pilot.flightPlan.departureId?.includes('LE')

export const downloadFile = (base64Key: string, address: string) => {
  const key = Buffer.from(base64Key, 'base64').toString()
  const blob = new Blob([key], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `weifly-private-key-${address.slice(-4)}.pem`

  // Append the <a> element to the document and trigger the click event
  document.body.appendChild(a)
  a.click()

  // Clean up the temporary URL object
  URL.revokeObjectURL(url)

  // Remove the <a> element from the document
  document.body.removeChild(a)
}

export const validateEmail = (email?: string) => {
  if (!email) return false
  const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return expression.test(email)
}

export const getFuelForFlight = (distance: number, aircraftType: IcaoCode, passengers: number = 2) => {
  switch (aircraftType) {
    case 'AN225': {
      return (distance * 9.99) + 10000
    }
    case 'A20N': {
      return (distance * (0.0225 * Math.min(passengers, 2))) + 1000
    }
    case 'A21N': {
      return (distance * 2.8) + 1000
    }
    case 'A319': {
      return (distance * 2.45) + 1000
    }
    case 'A320': {
      return (distance * 3) + 1000
    }
    case 'A321': {
      return (distance * 2.225) + 1000
    }
    case 'A339': {
      return (distance * 2.21) + 1000
    }
    case 'B350': {
      return (distance * 0.67) + 3000
    }
    case 'B748': {
      return (distance * 4) + 6000
    }
    case 'B738': {
      return (distance * 2.5) + 7000
    }
    case 'B739': {
      return (distance * 2.45) + 6000
    }
    case 'B737': {
      return (distance * 2.75) + 1000
    }
    case 'B763': {
      return (distance * 4.8) + 1000
    }
    case 'B77W': {
      return (distance * 5.5) + 4000
    }
    case 'B788': {
      return (distance * 2.4) + 3000
    }
    case 'C172': {
      return (distance * 0.36) + 15
    }
    case 'C700':
      return (distance * 5.43) + 600
    default:
      return distance * 1.325
  }
}


export const reduceTowerMatrix =
  (atcs: ActiveAtc[]) =>
  (acc: TowerMatrixList, curr: ActiveAtc): TowerMatrixList =>
    [
      ...acc,
      {
        [curr.callsign]: {
          airport: curr.atcPosition?.airport,
          destinations: atcs
            .map((atc: ActiveAtc) =>
              atc.callsign === curr.callsign
                ? { distance: 0 }
                : {
                    ...(atc.atcPosition ? { ...atc.atcPosition.airport } : {}),
                    distance: getDistanceByCoords(curr.atcPosition?.airport, atc.atcPosition?.airport) ?? 0,
                    callsign: atc.callsign
                  }
            )
            .filter((d) => d.distance > 0)
            .sort((a, b) => a.distance - b.distance)
        } as TowerMatrix
      }
    ] as TowerMatrixList

/** Reduce and remove duplicated towers */
export const reduceAtcTower = (acc: ActiveAtc[], curr: ActiveAtc) => {
  const currentCallsign = curr.callsign.split('_')[0]
  return acc.some((c) => c?.callsign.split('_')[0] === currentCallsign)
    ? acc
    : new RegExp(/[A-Z][A-Z][A-Z][A-Z](_TWR)+/g).test(curr.callsign)
      ? [...acc, curr]
      : acc
}

export const findByCallsign = (callsign: string) => (f: Airport) => f.callsign === callsign
export const getIcaoCodeFromAircraftNFT = (name: keyof typeof aircraftNameToIcaoCode) => aircraftNameToIcaoCode[name]

export const hasRequirement = (aircrafts: NFT[], distance: number, requirement?: string) => {
  if (!requirement) return false
  const aircraft = aircrafts.find((aircraft) => aircraft.metadata.id === requirement)
  if (!aircraft) return false

  const icaoCode = getIcaoCodeFromAircraftNFT(aircraft.metadata.name as keyof typeof aircraftNameToIcaoCode)
  if (!icaoCode) return false

  const fuel = getFuelForFlight(distance ?? 0, icaoCode)

  const combustible = getNFTAttributes(aircraft).find((a) => a.trait_type === 'combustible')?.value
  if (!combustible) return false

  return fuel < gallonsToLiters(Number(combustible))
}

export const gallonsToLiters = (gallons?: number): number => {
  if (!gallons) return 0
  const litersPerGallon = 3.78541 // 1 gallon is approximately 3.78541 liters
  return gallons * litersPerGallon
}

export const fetcher = (url: string) => nextApiInstance.get(url).then((res) => res.data)
