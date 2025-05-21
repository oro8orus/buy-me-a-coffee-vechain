// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract BuyMeACoffee {
    event NewCoffee(address indexed sender, string name, string message, uint256 timestamp);

    struct Coffee {
        address sender;
        string name;
        string message;
        uint256 timestamp;
    }

    Coffee[] public coffees;
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Cannot buy coffee for free");

        coffees.push(Coffee(msg.sender, _name, _message, block.timestamp));
        emit NewCoffee(msg.sender, _name, _message, block.timestamp);
    }

    function withdrawTips() public {
        require(msg.sender == owner, "Only owner can withdraw");
        owner.transfer(address(this).balance);
    }

    function getCoffees() public view returns (Coffee[] memory) {
        return coffees;
    }
}
