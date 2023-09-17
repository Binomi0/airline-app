// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@thirdweb-dev/contracts/base/ERC1155Drop.sol';

contract LicenseNFT is ERC1155Drop {
  mapping(address => uint256) private allowedClaimers;

  constructor(
    address _defaultAdmin,
    string memory _name,
    string memory _symbol,
    address _royaltyRecipient,
    uint128 _royaltyBps,
    address _primarySaleRecipient
  ) ERC1155Drop(_defaultAdmin, _name, _symbol, _royaltyRecipient, _royaltyBps, _primarySaleRecipient) {}

  function _beforeClaim(
    uint256 _tokenId,
    address _receiver,
    uint256 _quantity,
    address _currency,
    uint256 _pricePerToken,
    AllowlistProof calldata _allowlistProof,
    bytes memory _data
  ) internal view virtual override {
    if (_tokenId >= nextTokenIdToLazyMint) {
      revert('Not enough minted tokens');
    }
    require(_receiver != msg.sender, 'Can not send to itself');
    require(_allowlistProof.currency == _currency, 'Wrong currency');
    require(_allowlistProof.quantityLimitPerWallet == _quantity, 'Maximum exceeded');
    require(_allowlistProof.pricePerToken == _pricePerToken, 'Wrong price per token');

    if (_tokenId == 0) {} else if (_tokenId == 1) {
      uint256 balance = this.balanceOf(_receiver, 0);
      require(balance > 0, 'Do not have required license 0');
    } else if (_tokenId == 2) {
      uint256 balance = this.balanceOf(_receiver, 1);
      require(balance > 0, 'Do not have required license 1');
    } else if (_tokenId == 3) {
      uint256 balance = this.balanceOf(_receiver, 2);
      require(balance > 0, 'Do not have required license 2');
    }
  }

  function _afterClaim(
    uint256 _tokenId,
    address _receiver,
    uint256 _quantity,
    address _currency,
    uint256 _pricePerToken,
    AllowlistProof calldata _allowlistProof,
    bytes memory _data
  ) internal view virtual override {
    require(_tokenId < nextTokenIdToLazyMint, 'Invalid token id');
    require(_receiver != msg.sender, 'Can not send to itself');
    require(_allowlistProof.currency == _currency, 'Wrong currency');
    require(_allowlistProof.quantityLimitPerWallet == _quantity, 'Maximum exceeded');
    require(_allowlistProof.pricePerToken == _pricePerToken, 'Wrong price per token');
  }
}
