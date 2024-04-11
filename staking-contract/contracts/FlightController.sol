// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import './AircraftNft.sol';

contract FlightController {
  address public adminAddress;
  address public aircraftAddress;
  mapping(address => string) public flightId;
  mapping(string => FlightStatus) public flightStatus;
  enum FlightStatus {
    CREATED,
    STARTED,
    FINISHED
  }

  modifier onlyAdmin() {
    require(msg.sender == adminAddress);
    _;
  }

  event FlightStarted(address pilot, string flightId);

  constructor(address _defaultAdmin, address _aircraftAddress) {
    adminAddress = _defaultAdmin;
    aircraftAddress = _aircraftAddress;
  }

  function startFlight(string memory _flightId, uint aircraftId) public {
    require(flightStatus[_flightId] == FlightStatus.CREATED, 'Flight is already started or completed');

    ERC1155Drop erc1155Contract = ERC1155Drop(aircraftAddress);
    uint256 balance = erc1155Contract.balanceOf(msg.sender, aircraftId);
    require(balance > 0, 'Do not have required aircraft');

    flightId[msg.sender] = _flightId;
    flightStatus[_flightId] = FlightStatus.STARTED;

    emit FlightStarted(msg.sender, _flightId);
  }

  function completeFlight(string memory _flightId) public onlyAdmin {
    require(
      keccak256(abi.encodePacked(flightId[msg.sender])) == keccak256(abi.encodePacked(_flightId)),
      'This flight is not active.'
    );

    flightId[msg.sender] = 'COMPLETE';
    flightStatus[_flightId] = FlightStatus.FINISHED;
  }
}
