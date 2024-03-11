import { ethers } from 'hardhat'
import { deployAircraftNFT, lazyMintAircraft, setClaimConditionsAircraft } from '../utils'
import { AirlineCoin, LicenseNFT } from '../typechain-types'

const deployAircraft = async (airlineCoin: AirlineCoin, license: LicenseNFT) => {
  const [owner] = await ethers.getSigners()
  const aircraft = await deployAircraftNFT(owner, license.address)

  await lazyMintAircraft('4', 0, owner, aircraft)
  await setClaimConditionsAircraft(aircraft, 0, airlineCoin)
  // await mintAircraft(aircraft, otherAccount, 0, airlineCoin)

  await lazyMintAircraft('4', 1, owner, aircraft)
  await setClaimConditionsAircraft(aircraft, 1, airlineCoin)
  // await mintAircraft(aircraft, otherAccount, 1, airlineCoin)

  await lazyMintAircraft('4', 2, owner, aircraft)
  await setClaimConditionsAircraft(aircraft, 2, airlineCoin)
  // await mintAircraft(aircraft, otherAccount, 2, airlineCoin)

  await lazyMintAircraft('4', 3, owner, aircraft)
  await setClaimConditionsAircraft(aircraft, 3, airlineCoin)
  // await mintAircraft(aircraft, otherAccount, 3, airlineCoin)

  return { aircraft, license }
}

export default deployAircraft
