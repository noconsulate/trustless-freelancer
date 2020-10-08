import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.6.12;

contract Freelancer is Ownable {
  address payable private merchant;
  address payable private client;
  bool isShipped = false;
  bool isReceived = false;

  // Client funds escrow and sets role as client
  receive() external payable {
    require(client == address(0), "Contract already paid for");
    client = payable(msg.sender);
  }  

  // Contract owner can set merchant role
  function setMerchant(address payable _merchant) public onlyOwner {
    merchant = payable(_merchant);
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

  // Refund payment to client
  function refund() public {
    require(msg.sender == merchant, "only merchant can refund");
    client.transfer(address(this).balance);
  }
}