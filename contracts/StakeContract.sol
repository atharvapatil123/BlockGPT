// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract StakeContract {
    uint256 stakeAmount = 0.00001 ether;

    mapping(address => uint256) public stakes;

    event Stake(address indexed user, uint256 amount, uint256 when);

    constructor() payable {}

    function getStakeAmountValue() public view returns (uint256) {
        return stakeAmount;
    }
    
    function addStakedAmount() public payable {
        require(msg.value == stakeAmount, "You must stake 0.001 ether");
        payable(address(this)).transfer(stakeAmount);
        stakes[msg.sender] += msg.value;
    }

    function getStakeAmount() public payable {
        require(stakes[msg.sender] >= stakeAmount, "You must stake 0.001 ether");
        payable(msg.sender).transfer(stakeAmount);
        stakes[msg.sender] -= stakeAmount;
    }
}
