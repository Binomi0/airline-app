import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { ethers } from 'hardhat'

const deployTokens = async (owner: SignerWithAddress) => {
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

  return { owner, airLine, airLineReward, nativeTokenWrapper }
}

export default deployTokens
