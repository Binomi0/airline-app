import { time } from '@nomicfoundation/hardhat-network-helpers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { ethers } from 'hardhat'
import { AircraftNFT, AirlineCoin, LicenseNFT } from './typechain-types'
import { aircrafts, licenses } from './contants'
import { hexlify } from 'ethers/lib/utils'

export async function deployAirlineCoin(owner: string) {
  const AirlineCoin = await ethers.getContractFactory('AirlineCoin')
  const airlineCoin = await AirlineCoin.deploy(owner, 'Airline Coin', 'AIRL')
  await airlineCoin.deployed()
  return airlineCoin
}

export async function deployLicenseNFT(owner: string) {
  const License = await ethers.getContractFactory('LicenseNFT')
  const license = await License.deploy(owner, 'License', 'AIRC', owner, 0, owner)
  await license.deployed()
  return license
}

export async function deployAircraftNFT(owner: SignerWithAddress, licenseAddress: string) {
  const Aircraft = await ethers.getContractFactory('AircraftNFT')
  const aircraft = await Aircraft.deploy(
    owner.address,
    'Aircraft',
    'AIRA',
    owner.address,
    0,
    owner.address,
    licenseAddress
  )
  await aircraft.deployed()
  return aircraft
}

export async function setClaimConditionsLicense(license: LicenseNFT, tokenId: number, airlineCoin: AirlineCoin) {
  await license.setClaimConditions(
    tokenId,
    {
      currency: airlineCoin.address,
      maxClaimableSupply: 100,
      metadata: JSON.stringify(licenses[tokenId]),
      startTimestamp: await time.latest(),
      quantityLimitPerWallet: 1,
      pricePerToken: licenses[tokenId].price,
      supplyClaimed: 0,
      merkleRoot: '0x0000000000000000000000000000000000000000000000000000000000000000'
    },
    false
  )
}

export async function mintLicense(
  license: LicenseNFT,
  otherAccount: SignerWithAddress,
  tokenId: number,
  airlineCoin: AirlineCoin,
  amount = 1
) {
  const cc = await license.claimCondition(tokenId)
  const encodedData = ethers.utils.defaultAbiCoder.encode(['uint256'], [tokenId])

  await license.claim(
    otherAccount.address,
    tokenId,
    amount,
    airlineCoin.address,
    licenses[tokenId].price,
    {
      proof: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
      quantityLimitPerWallet: cc.quantityLimitPerWallet,
      pricePerToken: cc.pricePerToken,
      currency: cc.currency
    },
    ethers.utils.hexlify(encodedData)
  )
}

export async function lazyMintLicense(_amount: string, tokenId: number, owner: SignerWithAddress, license: LicenseNFT) {
  const amount = ethers.utils.parseUnits(_amount, 'wei') // Minting 1 token
  const baseURIForTokens = 'http://localhost:3000/api/metadata/license' // Replace with your actual base URI
  const encryptedURI = await owner.signMessage(`${baseURIForTokens}/${tokenId}`)
  const provenanceHash = ethers.utils.formatBytes32String(tokenId.toString()) // Convert to bytes32
  const _data = ethers.utils.defaultAbiCoder.encode(
    ['bytes', 'bytes32'],
    [ethers.utils.arrayify(encryptedURI), provenanceHash]
  )

  try {
    await license.lazyMint(amount, baseURIForTokens, _data)
    await license.deployed()

    return true
  } catch (error) {
    console.log('ERROR =>', error)
    return false
  }
}

export async function setClaimConditionsAircraft(aircraft: AircraftNFT, tokenId: number, airlineCoin: AirlineCoin) {
  await aircraft.setClaimConditions(
    tokenId,
    {
      currency: airlineCoin.address,
      maxClaimableSupply: 100,
      metadata: JSON.stringify(aircrafts[tokenId]),
      startTimestamp: await time.latest(),
      quantityLimitPerWallet: 1,
      pricePerToken: aircrafts[tokenId].price,
      supplyClaimed: 0,
      merkleRoot: '0x0000000000000000000000000000000000000000000000000000000000000000'
    },
    false
  )
}

export async function mintAircraft(
  aircraft: AircraftNFT,
  otherAccount: SignerWithAddress,
  tokenId: number,
  airlineCoin: AirlineCoin,
  amount = 1
) {
  const cc = await aircraft.claimCondition(tokenId)
  const encodedData = ethers.utils.defaultAbiCoder.encode(['uint256'], [tokenId])

  await aircraft.claim(
    otherAccount.address,
    tokenId,
    amount,
    airlineCoin.address,
    aircrafts[tokenId].price,
    {
      proof: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
      quantityLimitPerWallet: cc.quantityLimitPerWallet,
      pricePerToken: cc.pricePerToken,
      currency: cc.currency
    },
    ethers.utils.hexlify(encodedData)
  )
}

export async function lazyMintAircraft(
  _amount: string,
  tokenId: number,
  owner: SignerWithAddress,
  aircraft: LicenseNFT
) {
  const amount = ethers.utils.parseUnits(_amount, 'wei') // Minting 1 token
  const baseURIForTokens = 'http://localhost:3000/api/metadata/aircraft' // Replace with your actual base URI
  const encryptedURI = await owner.signMessage(`${baseURIForTokens}/${tokenId}`)
  const provenanceHash = ethers.utils.formatBytes32String(tokenId.toString()) // Convert to bytes32
  const _data = ethers.utils.defaultAbiCoder.encode(
    ['bytes', 'bytes32'],
    [ethers.utils.arrayify(encryptedURI), provenanceHash]
  )

  try {
    await aircraft.lazyMint(amount, baseURIForTokens, _data)

    return true
  } catch (error) {
    console.log('ERROR =>', error)
    return false
  }
}
