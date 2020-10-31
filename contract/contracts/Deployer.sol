pragma solidity ^0.6.12;

import "./Freelancer.sol";

contract Deployer {
    mapping(address => address) contractByOwner;

    function getContract() public view returns (address) {
        return contractByOwner[msg.sender];
    }

    function deploy() public {
        require(
            contractByOwner[msg.sender] == address(0),
            "this address already has a contract!"
        );
        Freelancer freelancer = new Freelancer(
            msg.sender,
            // address of token
            address(0xDdbfd4Bb2CFFfe0BEe18C5F11eDc22eFe6237266)
        );
        contractByOwner[msg.sender] = address(freelancer);
    }
}
