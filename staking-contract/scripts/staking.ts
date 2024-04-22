import { ethers } from 'hardhat'
import { parseUnits } from 'ethers/lib/utils'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { AirlineCoin, AirlineRewardCoin, NativeTokenWrapper } from '../typechain-types'

const handleError = (err: unknown) => {
  const { error } = err as { error: Error }
  console.log(error.message)
}

const deployStaking = async (
  accounts: SignerWithAddress[],
  airLine: AirlineCoin,
  airLineReward: AirlineRewardCoin,
  nativeTokenWrapper: NativeTokenWrapper
) => {
  const [owner, otherAccount] = accounts
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

  console.group('----- owner -----')
  console.log(new Date(), 'airLine balance =>', (await airLine.balanceOf(owner.address)).div(1e9).div(1e9).toString())
  console.log(
    new Date(),
    'airlineReward balance =>',
    (await airLineReward.balanceOf(owner.address)).div(1e9).div(1e9).toString()
  )
  console.groupEnd()
  console.group('----- otherAccount ------')
  console.log(
    new Date(),
    'airLine balance =>',
    (await airLine.connect(otherAccount).balanceOf(owner.address)).div(1e9).div(1e9).toString()
  )
  console.log(
    new Date(),
    'airlineReward balance =>',
    (await airLineReward.connect(otherAccount).balanceOf(owner.address)).div(1e9).div(1e9).toString()
  )
  console.groupEnd()

  console.log('Owner now deposits all its own AIRG into staking contract')
  await airLineReward.approve(stakingAirline.address, parseUnits('1000000000', 'ether'))
  await stakingAirline.depositRewardTokens(parseUnits('1000000000', 'ether'))
  console.log('airlineReward balance =>', (await airLineReward.balanceOf(owner.address)).div(1e9).div(1e9).toString())
  console.log('Now balance of owner AIRG is 0 and all is in staking contract')

  const stakingRewardBalance = await stakingAirline.getRewardTokenBalance()
  console.log('staking reward balance is', stakingRewardBalance.div(1e9).div(1e9).toString())

  console.log(
    'otherAccount airline balance =>',
    (await airLine.balanceOf(otherAccount.address)).div(1e9).div(1e9).toString()
  )
  console.log('now other account will stake 100.000 AIRL into staking contract')

  await airLine.connect(otherAccount).approve(stakingAirline.address, parseUnits('100000', 'ether'))
  // await airLine.transferFrom(otherAccount.address, stakingAirline.address, parseUnits('100', 'ether'))
  await stakingAirline.connect(otherAccount).stake(parseUnits('100000', 'ether'))
  console.log('otherAccount staked 100.000 AIRL')
  console.log(
    'otherAccount airline balance =>',
    (await airLine.balanceOf(otherAccount.address)).div(1e9).div(1e9).toString()
  )
  console.log('otherAccount AIRL at this point should be 0 since staked all')

  console.log(
    'tokensStaked => ',
    (await stakingAirline.connect(otherAccount).getStakeInfo(otherAccount.address))._tokensStaked
      .div(1e9)
      .div(1e9)
      .toString()
  )
  console.log('And staking balance should be equal of previously staked amount')
  const waitForStaking = async () => {
    const iterations = Array.from({ length: 1 }).map((_, i) => i)

    for await (const iteration of iterations) {
      console.log('Waiting...', iteration)
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  await waitForStaking()

  console.group('----- after waiting -----')
  console.log(
    'otherAccount AIRL balance =>',
    (await airLine.balanceOf(otherAccount.address)).div(1e9).div(1e9).toString()
  )
  await stakingAirline.connect(otherAccount).withdraw(parseUnits('100000', 'ether'))
  console.log('Now otherAccount withdraw all deposited AIRL tokens')
  console.log(
    'otherAccount AIRL balance =>',
    (await airLine.balanceOf(otherAccount.address)).div(1e9).div(1e9).toString()
  )
  console.groupEnd()

  console.group('---- rewards -----')

  const stakeInfo = await stakingAirline.connect(otherAccount).getStakeInfo(otherAccount.address)
  console.log('_rewards => ', stakeInfo._rewards.div(1e9).div(1e9).toString())
  console.log('_tokensStaked => ', stakeInfo._tokensStaked.div(1e9).div(1e9).toString())
  console.groupEnd()

  const rewards = stakeInfo._rewards

  if (stakingRewardBalance.gt(rewards)) {
    if (rewards.div(1e9).div(1e9).gt(100)) {
      console.log('TENGO SUFICIENTE')
      console.log('hay suficientes airg en el contrato de staking?')
      console.log((await stakingAirline.getRewardTokenBalance()).div(1e9).div(1e9).toString())
      try {
        await stakingAirline.connect(otherAccount).claimRewards()
      } catch (err) {
        handleError(err)
      }
      console.log('otherAccount AIRL balance =>', (await airLine.balanceOf(otherAccount.address)).toString())
    }
  }
}

export default deployStaking
