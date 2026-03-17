
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title WeiflyCrowdfunding
 * @dev Crowdfunding contract for Weifly 2.0. 
 * Allows buying AIRL tokens with USDC.
 * Implements a simple vesting mechanism.
 */
contract WeiflyCrowdfunding is Ownable, ReentrancyGuard {
    IERC20 public airlToken;
    IERC20 public usdcToken;
    
    uint256 public constant TOKEN_PRICE = 10; // 0.10 USDC per AIRL (assuming 6 decimals for USDC)
    uint256 public totalRaised;
    uint256 public constant GOAL = 500000 * 10**6;
    
    struct Investment {
        uint256 amountUSDC;
        uint256 totalAirl;
        uint256 claimedAirl;
        uint256 startTime;
    }
    
    mapping(address => Investment) public investments;
    
    event Invested(address indexed investor, uint256 amountUSDC, uint256 amountAirl);
    event TokensClaimed(address indexed investor, uint256 amount);

    constructor(address _airlToken, address _usdcToken) Ownable(msg.sender) {
        airlToken = IERC20(_airlToken);
        usdcToken = IERC20(_usdcToken);
    }

    function invest(uint256 _amountUSDC) external nonReentrant {
        require(_amountUSDC >= 100 * 10**6, "Min investment $100");
        require(totalRaised + _amountUSDC <= GOAL, "Goal exceeded");
        
        uint256 airlAmount = (_amountUSDC * 10); // Simple 10:1 ratio for example
        
        usdcToken.transferFrom(msg.sender, address(this), _amountUSDC);
        
        Investment storage investment = investments[msg.sender];
        if (investment.startTime == 0) {
            investment.startTime = block.timestamp;
        }
        investment.amountUSDC += _amountUSDC;
        investment.totalAirl += airlAmount;
        
        totalRaised += _amountUSDC;
        
        emit Invested(msg.sender, _amountUSDC, airlAmount);
    }

    function claimTokens() external nonReentrant {
        Investment storage investment = investments[msg.sender];
        require(investment.totalAirl > 0, "No investment");
        
        uint256 claimable = calculateClaimable(msg.sender);
        require(claimable > 0, "Nothing to claim at this moment");
        
        investment.claimedAirl += claimable;
        airlToken.transfer(msg.sender, claimable);
        
        emit TokensClaimed(msg.sender, claimable);
    }

    function calculateClaimable(address _investor) public view returns (uint256) {
        Investment memory investment = investments[_investor];
        if (investment.startTime == 0) return 0;
        
        uint256 timePassed = block.timestamp - investment.startTime;
        uint256 vestingDuration = 365 days; // 1 year vesting
        
        if (timePassed >= vestingDuration) {
            return investment.totalAirl - investment.claimedAirl;
        }
        
        uint256 totalVestable = (investment.totalAirl * timePassed) / vestingDuration;
        return totalVestable - investment.claimedAirl;
    }

    function withdrawUSDC() external onlyOwner {
        usdcToken.transfer(owner(), usdcToken.balanceOf(address(this)));
    }
}
