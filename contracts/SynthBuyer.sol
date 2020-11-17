// SPDX-License-Identifier: MIT

pragma solidity >=0.5.16;

import 'synthetix/contracts/interfaces/IAddressResolver.sol';
import "synthetix/contracts/interfaces/IDepot.sol";

contract SynthBuyer {
  // This should be instantiated with our ReadProxyAddressResolver
  // it's a ReadProxy that won't change, so safe to code it here without a setter
  // see https://docs.synthetix.io/addresses for addresses in mainnet and testnets
  IAddressResolver public synthetixResolver;

  mapping(address => uint256) private balances;

  event Buy(address user, uint256 snx);

  constructor() public {
    synthetixResolver = IAddressResolver(address(0xc6F404c96Aa136b0Ba11d40dB17394F09B0f20F1));
  }

  function buySNX(uint256 etherAmount) payable public returns (uint256 amount)  {
    IDepot depot = IDepot(synthetixResolver.getAddress("Depot"));
    require(address(depot) != address(0), "Depot is missing from Synthetix resolver");

    require(msg.value > etherAmount, "Insufficient value provided");

    uint256 snx = depot.exchangeEtherForSNX{value: etherAmount}();

    balances[msg.sender] = balances[msg.sender] + snx;

    return snx;
  }

  function getBalance() public view returns (uint256 balance) {
    return balances[msg.sender];
  }

}