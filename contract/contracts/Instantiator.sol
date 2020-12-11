/*
TOKEN ADDRESSES: (use in deployment)

my local token: 0xDdbfd4Bb2CFFfe0BEe18C5F11eDc22eFe6237266 
DAIropsten: 0xaD6D458402F60fD3Bd25163575031ACDce07538D
*/

pragma solidity ^0.6.12;

import "./Freelancer.sol";

contract Instantiator {
    mapping(address => address) contractByOwner;

    address token;
    address[] owners;

    constructor(address _token) public {
        token = _token;
    }

    function getContract() public view returns (address) {
        return contractByOwner[msg.sender];
    }

    function deploy(
        string memory _contractName,
        uint256 _serviceFee,
        address referrer
    ) public {
        require(
            contractByOwner[msg.sender] == address(0),
            "this address already has a contract!"
        );
        Freelancer freelancer = new Freelancer(
            msg.sender,
            _contractName,
            // address of token
            address(token),
            _serviceFee,
            referrer
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
