pragma solidity ^0.6.12;

import "./Freelancer.sol";

contract Instantiator {
    mapping(address => address) contractByOwner;

    address[] owners;

    function getContract() public view returns (address) {
        return contractByOwner[msg.sender];
    }

    function deploy(string memory _contractName) public {
        require(
            contractByOwner[msg.sender] == address(0),
            "this address already has a contract!"
        );
        Freelancer freelancer = new Freelancer(
            msg.sender,
            _contractName,
            // address of token
            address(0xDdbfd4Bb2CFFfe0BEe18C5F11eDc22eFe6237266)
        );
        contractByOwner[msg.sender] = address(freelancer);
        owners.push(msg.sender);
    }

    function clearAll() public {
        uint256 length = owners.length;

        for (uint256 i = length; i > 0; i--) {
            delete contractByOwner[owners[i - 1]];
        }

        delete owners;
    }
}
