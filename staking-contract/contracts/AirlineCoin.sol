// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@thirdweb-dev/contracts/base/ERC20Base.sol";

contract AirlineCoin is ERC20Base {
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20Base(_name, _symbol) {
        // 1 millon + 18
        mintTo(address(msg.sender), 1_000_000_000_000_000_000_000_000);
    }
}
