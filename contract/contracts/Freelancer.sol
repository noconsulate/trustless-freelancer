import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.6.12;

contract Freelancer is Ownable {

  struct Escrow {
 //   address payable merchant;
    uint256 balance;
    bool isShipped;
    bool isReceived;
  }

  mapping(address => Escrow) escrows;
 // mapping(address => address) clientLookup;
  address[] public clients;

  event Deposit(address , uint _value);

  function logtest(uint _value) public {
    emit Deposit(msg.sender, _value);
  }

  receive() external payable {
    Escrow storage escrow = escrows[address(msg.sender)];
    // reject transfer from address already associated with escrow
    require(escrow.balance == 0, "this address already has an escrow");

    escrow.balance = msg.value;
    clients.push(msg.sender);

    emit Deposit(msg.sender, msg.value);
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
      _cleanup(_client);
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
      _cleanup(msg.sender);
    }
  }

  function refund(address _client) public onlyOwner {
    Escrow storage escrow = escrows[_client];
    require(escrow.balance > 0, "this escrow is empty!");

    payable(_client).transfer(escrow.balance);
    delete escrows[_client];
    _cleanup(_client);
  }

  function reset() public onlyOwner {
    address owner = owner();
    uint256 length = clients.length;

    for (uint256 i = length; i > 0; i--) {
      payable(owner).transfer(escrows[clients[i - 1]].balance);
      delete escrows[clients[i - 1]];
      // delete clients[i - 1];
    }
    delete clients;
  }

  // is this effecient?
  function _cleanup(address _client) private {
    uint256 length = clients.length;
    uint256 indexToDelete;

    for (uint256 i = 0; i < length; i++) {
      if (clients[i] == _client) {
        indexToDelete = i;
      }
    }

    // if indexToDelete is not last in array, swap position
    if (indexToDelete < length - 1) {
      clients[indexToDelete] = clients[length -1];
    }
    // remove last element
    delete clients[length - 1];
  }

  function getEscrowValues(address _escrow) public view returns (
    uint256, bool, bool
    ) {
    
    Escrow memory escrow = escrows[_escrow];
    return (
      escrow.balance, escrow.isShipped, escrow.isReceived
      );
  }

  function getClients() public view returns (address[] memory) {
  return clients;
  }

  function getOwner() public view returns (address) {
    address owner = owner();
    return owner;
  }
}