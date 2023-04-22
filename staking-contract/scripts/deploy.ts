import { ethers } from "hardhat";

async function main() {
  const Airline = await ethers.getContractFactory("AirlineCoin");
  const airLine = await Airline.deploy("Airline Coin", "AIRL");
  await airLine.deployed();

  console.log(`Airline deployed to ${airLine.address}`);

  const AirlineRewardCoin = await ethers.getContractFactory(
    "AirlineRewardCoin"
  );
  const airLineReward = await AirlineRewardCoin.deploy("Airline Gas", "FLG");
  await airLineReward.deployed();

  console.log(`Airline deployed to ${airLineReward.address}`);

  const NativeTokenWrapper = await ethers.getContractFactory(
    "NativeTokenWrapper"
  );
  const nativeTokenWrapper = await NativeTokenWrapper.deploy(
    "Wrapped ETH",
    "WETH"
  );
  await nativeTokenWrapper.deployed();

  const StakingAirline = await ethers.getContractFactory("StakingAirline");
  const stakingAirline = await StakingAirline.deploy(
    1,
    1,
    100,
    airLine.address,
    airLineReward.address,
    nativeTokenWrapper.address
  );
  await stakingAirline.deployed();

  console.log("STAKING =>", stakingAirline.address);

  const [owner, otherAccount] = await ethers.getSigners();

  console.log(
    "airlineReward balance =>",
    await airLineReward.balanceOf(owner.address)
  );
  // await airLine.approve(stakingAirline.address, 100);
  await airLineReward.approve(stakingAirline.address, 1_000_000_000);
  await stakingAirline.depositRewardTokens(1_000_000_000);

  console.log(
    "airlineReward balance =>",
    await airLineReward.balanceOf(owner.address)
  );

  await airLine.approve(stakingAirline.address, 1_000_000);
  console.log(await airLine.balanceOf(owner.address));

  await stakingAirline.stake(1_000_000);
  console.log(await airLine.balanceOf(owner.address));

  await stakingAirline.withdraw(1_000_000);
  console.log(await airLine.balanceOf(owner.address));

  await stakingAirline.claimRewards();
  console.log(await airLineReward.balanceOf(owner.address));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
