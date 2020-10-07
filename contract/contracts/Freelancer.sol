pragma solidity ^0.6.12;

contract Freelancer {
  address payable private merchant;
  address payable private client;
  bool isShipped = false;
  bool isReceived = false;

  // Set merchant at deployment
  constructor(address payable _merchant) public {
    merchant = _merchant;
  }

  receive() external payable {
    require(client == address(0), "Contract already paid for");
    client = msg.sender;
  }  

  // Merchant indicates product has shipped
  function merchantMarkShipped() public {
    require(merchant == msg.sender, "only merchant can call this function");  
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