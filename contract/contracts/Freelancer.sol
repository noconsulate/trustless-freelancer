import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

pragma solidity ^0.6.12;

contract Freelancer is Ownable {
  using SafeMath for uint256; 

  address payable merchant = address(0);
  address payable client = address(0);
  bool isShipped = false;
  bool isReceived = false;

  mapping(address => uint256) public clients;
  mapping(address => address) merchants;

  // Return storage

  function getValues() public view returns (address, address, address, bool, bool) {
    address owner = owner();
    return (owner, merchant, client, isShipped, isReceived);
  }

  // Client funds escrow and sets role as client
  receive() external payable {
    clients[msg.sender] = msg.value;
  }  

  function getClientEscrow() public view returns (uint) {
    uint256 balance = clients[address(msg.sender)];

    return balance;
  }

  function setMerchant(address payable _merchant) public {
    merchants[msg.sender] = _merchant;
  }

  function getMerchant(address _client) public view returns (address) {
    address client = merchants[_client];
    return client;
  }

  // Set merchant role
  // function setMerchant(address payable _address) public {
  //   require(merchant == address(0), "the client has already been set");
  //   merchant = payable(_address);
  // }

  // Merchant indicates product has shipped
  function merchantMarkShipped() public {
    require(merchant == address(msg.sender), "only merchant can call this function");  
    isShipped = true;
  }

  // Client indicates product was received
  function clientMarkReceived() public {
    require(msg.sender == client, "Only client can call this function");
    isReceived = true;
  }

  // Disperse payment to merchant
  function disperse() public {
    require (isShipped == true && isReceived == true, "conditions not met");
    merchant.transfer(address(this).balance);
    this.reset();
  }

  // Refund payment to client 
  function refund() public {
    require(msg.sender == merchant, "only merchant can refund");
    client.transfer(address(this).balance);
    this.reset();
  }

  // Reset contract storage to original state
  function reset() public onlyOwner {
    merchant = address(0);
    client = address(0);
    isShipped = false;
    isReceived = false;
    client.transfer(address(this).balance);
  }

  function getFlags() public view returns (bool, bool) {
    return (isShipped, isReceived);
  }
}