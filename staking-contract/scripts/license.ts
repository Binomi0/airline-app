import { ethers } from 'hardhat'
import { deployLicenseNFT, lazyMintLicense, setClaimConditionsLicense } from '../utils'
import { AirlineCoin } from '../typechain-types'

const deployLicense = async (airlineCoin: AirlineCoin) => {
  const [owner] = await ethers.getSigners()
  const license = await deployLicenseNFT(owner.address)

  await lazyMintLicense('4', 0, owner, license)
  await setClaimConditionsLicense(license, 0, airlineCoin)

  await lazyMintLicense('4', 1, owner, license)
  await setClaimConditionsLicense(license, 1, airlineCoin)

  await lazyMintLicense('4', 2, owner, license)
  await setClaimConditionsLicense(license, 2, airlineCoin)

  await lazyMintLicense('4', 3, owner, license)
  await setClaimConditionsLicense(license, 3, airlineCoin)

  return license
}

export default deployLicense
