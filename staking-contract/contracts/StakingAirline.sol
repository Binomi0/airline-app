// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@thirdweb-dev/contracts/base/Staking20Base.sol";

contract StakingAirline is Staking20Base {
    constructor(
        uint256 _timeUnit,
        uint256 _rewardRatioNumerator,
        uint256 _rewardRatioDenominator,
        address _stakingToken,
        address _rewardToken,
        address _nativeTokenWrapper
    )
        Staking20Base(
            _timeUnit,
            _rewardRatioNumerator,
            _rewardRatioDenominator,
            _stakingToken,
            _rewardToken,
            _nativeTokenWrapper
        )
    {}

    /**
     *  @dev    Mint ERC20 rewards to the staker. Override for custom logic.
     *
     *  @param _staker    Address for which to calculated rewards.
     *  @param _rewards   Amount of tokens to be given out as reward.
     *
     */
    // function _mintRewards(
    //     address _staker,
    //     uint256 _rewards
    // ) internal virtual override {
    //     require(_rewards <= rewardTokenBalance, "Not enough reward tokens");
    //     rewardTokenBalance -= _rewards;
    //     CurrencyTransferLib.transferCurrencyWithWrapper(
    //         rewardToken,
    //         address(this),
    //         _staker,
    //         _rewards,
    //         nativeTokenWrapper
    //     );
    // }

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
