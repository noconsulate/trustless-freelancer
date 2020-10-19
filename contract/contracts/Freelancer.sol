import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

pragma solidity ^0.6.12;

contract Freelancer is Ownable {
  using SafeMath for uint256; 



  struct Escrow {
 //   address payable merchant;
    uint256 balance;
    bool isShipped;
    bool isReceived;
  }

  mapping(address => Escrow) escrows;
 // mapping(address => address) clientLookup;
  address[] public clients;

  receive() external payable {
    Escrow storage escrow = escrows[address(msg.sender)];
    // reject transfer from address already associated with escrow
    require(escrow.balance == 0, "this address already has an escrow");

    escrow.balance = msg.value;
    clients.push(msg.sender);
  }

  //interface should check onlyOwner?
  function markShipped(address _client) public onlyOwner {
    Escrow storage escrow = escrows[_client];
    require(escrow.balance > 0, "this escrow is empty!");
    escrow.isShipped = true;

    if (escrow.isReceived == true) {
      address owner = owner();
      payable(owner).transfer(escrow.balance);
      delete escrows[_client];
    }
  }

  function markReceived() public {
    Escrow storage escrow = escrows[msg.sender];
    require(escrow.balance > 0, "this escrow is empty!");
    escrow.isReceived = true;

    if(escrow.isShipped == true) {
      address owner = owner();
      payable(owner).transfer(escrow.balance);
      delete escrows[msg.sender];
    }
  }

  function refund(address _client) public onlyOwner {
    Escrow storage escrow = escrows[_client];
    require(escrow.balance > 0, "this escrow is empty!");

    payable(_client).transfer(escrow.balance);
    delete escrows[_client];
  }

  function getEscrowValues(address _escrow) public view returns (
    uint256, bool, bool
    ) {
    
    Escrow memory escrow = escrows[_escrow];
    return (
      escrow.balance, escrow.isShipped, escrow.isReceived
      );
  }
}