import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

pragma solidity ^0.6.12;

contract Freelancer is Ownable {
  using SafeMath for uint256; 



  struct Escrow {
    address payable merchant;
    uint256 balance;
    bool isShipped;
    bool isReceived;
  }

  mapping(address => Escrow) escrows;
  mapping(address => address) clientLookup;
  address[] public escrowAccounts;

  receive() external payable {
    Escrow storage escrow = escrows[address(msg.sender)];

    escrow.balance = msg.value;

    escrowAccounts.push(msg.sender);
  }

  //lets you set merchant to 0 balance address
  function setMerchant(address payable _merchant) public {
    Escrow storage escrow = escrows[address(msg.sender)];
    require(escrow.merchant == address(0), "merchant already set, cannot be changed");
    escrow.merchant = _merchant;
    clientLookup[_merchant] = msg.sender;
  }

  function markShipped() public {
    address client = clientLookup[msg.sender];
    Escrow storage escrow = escrows[payable(client)];

    require(escrow.merchant == msg.sender, "merchant not associated with client");
    require(escrow.balance > 0, "escrow must be funded");

    escrow.isShipped = true;
  }

  function markReceived() public {
    Escrow storage escrow = escrows[payable(msg.sender)];
    require(escrow.merchant != payable(0) || escrow.balance > 0, "escrow isn't funded or no merchant");

    escrow.isReceived = true;
  }

  function getEscrowValues(address _escrow) public view returns (
    uint256, address, bool, bool
    ) {
    
    Escrow memory escrow = escrows[_escrow];
    return (
      escrow.balance,  escrow.merchant, escrow.isShipped, escrow.isReceived
      );
  }


}