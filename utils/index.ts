import { NFT } from '@thirdweb-dev/sdk'
import { Atc, AttributeType, Cargo, IvaoPilot } from 'types'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import BigNumber from 'bignumber.js'

// A unique identifier for your website
const rpID = process.env.DOMAIN
console.log({ rpID })
// The URL at which registrations and authentications should occur
const origin = [process.env.ORIGIN, process.env.ORIGIN_MAIN]

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

export const getDistanceByCoords = async (atcs: Readonly<Atc[]>, cargo: Pick<Cargo, 'origin' | 'destination'>) => {
  if (!cargo.origin) return 0

  const originTower = atcs.find((a) => a.callsign && a.callsign.startsWith(cargo.origin))
  const arrivalTower = atcs.find((a) => a.callsign && a.callsign.startsWith(cargo.destination))

  if (!originTower) {
    throw new Error(`Missing tower for ${cargo.origin}`)
  }
  if (!arrivalTower) {
    throw new Error(`Missing tower for ${cargo.origin}`)
  }

  const originCoords = {
    latitude: originTower?.lastTrack?.latitude,
    longitude: originTower?.lastTrack?.longitude
  }
  const arrivalCoords = {
    latitude: arrivalTower?.lastTrack?.latitude,
    longitude: arrivalTower?.lastTrack?.longitude
  }

  const horizontal = Math.pow(Number(arrivalCoords.longitude) - Number(originCoords.longitude), 2)
  const vertical = Math.pow(Number(arrivalCoords.latitude) - Number(originCoords.latitude), 2)
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
    throw new Error('Missing attribute')
  }

  return Number(attribute.value) * randomIntFromInterval(40, 70) || 0
}

export function getCargoPrize(distance: number, aircraft: NFT) {
  const attribute = getNFTAttributes(aircraft).find((attr) => attr.trait_type === 'license')
  if (attribute) {
    const base = Math.floor(distance / 100)
    switch (attribute.value) {
      case 'D':
        return base * (1 + randomIntFromInterval(35, 75))
      case 'C':
        return base * (1 + randomIntFromInterval(35, 75) * 10)
      case 'B':
        return base * (1 + randomIntFromInterval(35, 75) * 100)
      case 'A':
        return base * (1 + randomIntFromInterval(35, 75) * 1000)
      default:
        return base * (1 + randomIntFromInterval(35, 75))
    }
  }
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
  a.download = `airline-walley-key-${address.slice(-4)}.pem`

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

export const getFuelForFlight = (distance: BigNumber, aircraftType: string, passengers: number = 2) => {
  switch (aircraftType) {
    case 'AN225': {
      return distance.multipliedBy(9.99)
    }
    case 'A20N': {
      return distance.multipliedBy(0.0225 * Math.min(passengers, 2))
    }
    case 'A21N': {
      return distance.multipliedBy(2.8)
    }
    case 'A319': {
      return distance.multipliedBy(2.45)
    }
    case 'A320': {
      return distance.multipliedBy(3)
    }
    case 'A321': {
      return distance.multipliedBy(2.225)
    }
    case 'A339': {
      return distance.multipliedBy(2.21)
    }
    case 'B350': {
      return distance.multipliedBy(0.67)
    }
    case 'B748': {
      return distance.multipliedBy(4)
    }
    case 'B738': {
      return distance.multipliedBy(2.5)
    }
    case 'B739': {
      return distance.multipliedBy(2.45)
    }
    case 'B737': {
      return distance.multipliedBy(2.75)
    }
    case 'B763': {
      return distance.multipliedBy(4.8)
    }
    case 'B77W': {
      return distance.multipliedBy(5.5)
    }
    case 'B788': {
      return distance.multipliedBy(2.4)
    }
    case 'C172': {
      return distance.multipliedBy(0.36)
    }
    case 'C700':
      return distance.multipliedBy(5.43)
    default:
      return distance.multipliedBy(1.325)
  }
}
