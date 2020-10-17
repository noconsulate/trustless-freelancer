import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

pragma solidity ^0.6.12;

contract Freelancer is Ownable {
  using SafeMath for uint256; 



  struct Escrow {
    address merchant;
    uint256 balance;
    bool isShipped;
    bool isReceived;
  }

  mapping(address => Escrow) escrows;
  address[] public escrowAccounts;

  receive() external payable {
    Escrow storage escrow = escrows[address(msg.sender)];

    escrow.balance = msg.value;

    escrowAccounts.push(msg.sender);
  }

  function getEscrowValues(address _escrow) public view returns (uint256) {
    return (escrows[_escrow].balance);
  }


}