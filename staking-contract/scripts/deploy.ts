import { ethers } from 'hardhat'
import deployAircraft from './aircraft'
import deployLicense from './license'
import deployTokens from './tokens'

async function main() {
  const accounts = await ethers.getSigners()
  const [owner] = accounts
  const { airLine, airLineReward, nativeTokenWrapper } = await deployTokens(owner)

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
  await airLineReward.approve(stakingAirline.address, 1_000_000_000)
  await stakingAirline.depositRewardTokens(1_000_000_000)

  console.log('airlineReward balance =>', await airLineReward.balanceOf(owner.address))

  const license = await deployLicense(accounts, airLine)
  console.log('license =>', !!license)
  const aircraft = await deployAircraft(accounts, airLine, license)
  console.log('aircraft =>', !!aircraft)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
