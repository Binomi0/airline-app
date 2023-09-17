// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import '@thirdweb-dev/contracts/base/Staking20Base.sol';

contract StakingAirline is Staking20Base {
  uint256 private rewardTokenBalance;
  uint256 private minRewardWithDraw = 1e21;
  uint256 private minRewardBlock;

  constructor(
    uint80 _timeUnit,
    address _defaultAdmin,
    uint256 _rewardRatioNumerator,
    uint256 _rewardRatioDenominator,
    address _stakingToken,
    address _rewardToken,
    address _nativeTokenWrapper
  )
    Staking20Base(
      _timeUnit,
      _defaultAdmin,
      _rewardRatioNumerator,
      _rewardRatioDenominator,
      _stakingToken,
      _rewardToken,
      _nativeTokenWrapper
    )
  {
    minRewardBlock = block.number;
  }

  /**
   *  @dev    Mint ERC20 rewards to the staker. Override for custom logic.
   *
   *  @param _staker    Address for which to calculated rewards.
   *  @param _rewards   Amount of tokens to be given out as reward.
   *
   */
  function _mintRewards(address _staker, uint256 _rewards) internal virtual override {
    require(_rewards <= rewardTokenBalance, 'Not enough reward tokens');
    require(rewardTokenBalance >= minRewardWithDraw);
    require(block.number > minRewardBlock);

    rewardTokenBalance -= _rewards;
    CurrencyTransferLib.transferCurrencyWithWrapper(rewardToken, address(this), _staker, _rewards, nativeTokenWrapper);
  }

  /**
   *  @notice    Stake ERC20 Tokens.
   *
   *  @dev       See {_stake}. Override that to implement custom logic.
   *
   *  @param _amount    Amount to stake.
   */
  //   function stake(uint256 _amount) external  virtual payable override nonReentrant {
  //     require(block.number > minRewardBlock);
  //     require(_amount > 1e18);

  //     minRewardBlock = block.number;
  //     _stake(_amount);
  //   }

  /**
   *  @notice    Withdraw staked ERC20 tokens.
   *
   *  @dev       See {_withdraw}. Override that to implement custom logic.
   *
   *  @param _amount    Amount to withdraw.
   */
  //   function withdraw(uint256 _amount) external virtual override nonReentrant {
  //     require(block.number > minRewardBlock);
  //     require(_amount > 1e18);

  //     minRewardBlock = block.number;
  //     _withdraw(_amount);
  //   }

  /**
   *  @notice    Claim accumulated rewards.
   *
   *  @dev       See {_claimRewards}. Override that to implement custom logic.
   *             See {_calculateRewards} for reward-calculation logic.
   */
  //   function claimRewards() external virtual override nonReentrant {
  //     require(block.number > minRewardBlock);
  //     require(rewardTokenBalance > 1e21);

  //     _claimRewards();
  //   }

  /**
   *  @dev    Mint ERC20 rewards to the staker. Override for custom logic.
   *
   *  @param _staker    Address for which to calculated rewards.
   *  @param _rewards   Amount of tokens to be given out as reward.
   *
   */
  // function _mintRewards(address _staker, uint256 _rewards) internal override {
  //     TokenERC20 tokenContract = TokenERC20(rewardToken);
  //     tokenContract.mintTo(_staker, _rewards);
  // }
}
