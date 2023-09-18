import { ethers } from 'hardhat'
import deployAircraft from './aircraft'
import deployLicense from './license'

async function main() {
  const [owner] = await ethers.getSigners()
  const Airline = await ethers.getContractFactory('AirlineCoin')
  const airLine = await Airline.deploy(owner.address, 'Airline Coin', 'AIRL')
  await airLine.deployed()

  console.log(`Airline deployed to ${airLine.address}`)

  const AirlineRewardCoin = await ethers.getContractFactory('AirlineRewardCoin')
  const airLineReward = await AirlineRewardCoin.deploy(owner.address, 'Airline Gas', 'FLG')
  await airLineReward.deployed()

  console.log(`AirLineReward deployed to ${airLineReward.address}`)

  const NativeTokenWrapper = await ethers.getContractFactory('NativeTokenWrapper')
  const nativeTokenWrapper = await NativeTokenWrapper.deploy(owner.address, 'Wrapped ETH', 'WETH')
  await nativeTokenWrapper.deployed()

  console.log(`NativeTokenWrapper deployed to ${nativeTokenWrapper.address}`)

  const StakingAirline = await ethers.getContractFactory('StakingAirline')
  const stakingAirline = await StakingAirline.deploy(
    1,
    owner.address,
    1,
    100,
    airLine.address,
    airLineReward.address,
    nativeTokenWrapper.address
  )
  await stakingAirline.deployed()
  console.log(`STAKING deployed to ${stakingAirline.address}`)

  console.log('airlineReward balance =>', await airLineReward.balanceOf(owner.address))
  // await airLine.approve(stakingAirline.address, 100);
  await airLineReward.approve(stakingAirline.address, 1_000_000_000)
  await stakingAirline.depositRewardTokens(1_000_000_000)

  console.log('airlineReward balance =>', await airLineReward.balanceOf(owner.address))

  const license = await deployLicense(airLine)
  await deployAircraft(airLine, license)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
