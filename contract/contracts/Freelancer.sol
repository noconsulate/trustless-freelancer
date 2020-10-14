import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

pragma solidity ^0.6.12;

contract Freelancer is Ownable {
  using SafeMath for uint256; 

  address payable merchant = address(0);
  address payable client = address(0);
  bool isShipped = false;
  bool isReceived = false;

  // Return storage

  function getValues() public view returns (address, address, address, bool, bool) {
    address owner = owner();
    return (owner, merchant, client, isShipped, isReceived);
  }

  // Client funds escrow and sets role as client
  receive() external payable {
    require(client == address(0), "Contract already paid for");
    client = payable(msg.sender);
  }  

  // Contract owner can set merchant role and establish himself as admin
  function setMerchant(address payable _merchant) public onlyOwner {
    merchant = payable(_merchant);
  //  admin = payable(msg.sender);
  }

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
  }

  // Refund payment to client after taking 10% cut for admin
  function refund() public {
    require(msg.sender == merchant, "only merchant can refund");
    client.transfer(address(this).balance);
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