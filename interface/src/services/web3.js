const ENV_FLAG = "local";
const DEBUG_FLAG = false;

import Web3 from "web3";
import awaitTransactionMined from "await-transaction-mined";
import Freelancer from "../../../contract/build/contracts/Freelancer.json";

let node_url, address;

if (ENV_FLAG == "local") {
  node_url = "http://127.0.0.1:8545";
  address = "0xe79a43aef2BBEA79Fb83e0DA2d31d161f0Cfa31b";
}

class RequestParameters {
  constructor(to, from, data) {
    this.to = to;
    this.from = from;
    this.data = data;
  }
}

let ethereum;
if (typeof window.ethereum !== "undefined") {
  ethereum = window.ethereum;
}

//not sure what to set this! oh well
async function initWeb3() {
  const web3 = await new Web3(window.ethereum);
  console.log('web3 version:', web3);
  return web3;
}

async function loadContract(obj) {
  const contract = await new obj.eth.Contract(Freelancer.abi, address);
  return contract;
}

export async function awaitTxMined(txHash) {
  console.log("awaitTxMined()", txHash);
  const web3 = await initWeb3();

  let receipt;
  try {
    receipt = await awaitTransactionMined.awaitTx(web3, txHash, {
      blocksToWait: 1,
    });
    console.log(receipt);
  } catch (e) {
    console.log(e);
  }

  return receipt;
}

export async function getClients() {
  const web3 = await initWeb3();
  const contract = await loadContract(web3);

  let clients 

  try {
    clients = await contract.methods.getClients().call({ from: null });
  } catch (e) {
    console.log(e.message);
    throw e;
  }

  console.log(clients);
  return clients;
}
async function sendTx(parameters) {
  let txHash;
  try {
    txHash = await ethereum.request({
      method: "eth_sendTransaction",
      params: [parameters],
    });
    console.log(txHash);
  } catch (e) {
    console.log(e.message);
    throw e;
  }

  return txHash;
}

export async function getEscrowValues(client) {
  const web3 = await initWeb3();
  const contract = await loadContract(web3);

  let balance, isShipped, isReceived;

  try {
    let values = await contract.methods.getEscrowValues(client).call({ from: null });

    balance = values[0];
    isShipped = values[1];
    isReceived = values[2];
  } catch (e) {
    console.log(e.message);
    throw e;
  }

  balance = web3.utils.fromWei(balance, 'ether');
  
  const valuesObj = { balance, isShipped, isReceived, };
  
  return valuesObj;
}

export async function getValues() {
  const web3 = await initWeb3();
 
  const contract = await loadContract(web3);

  let owner, balance;

  try {
    owner = await contract.methods.getOwner().call({ from: null });
  } catch (e) {
    console.log("error in values fetch", e.message);
    throw e.code;
  }

  balance = await web3.eth.getBalance(address);
  console.log(balance);
  balance = web3.utils.fromWei(balance, "ether");

  const valuesObj = {
    owner, balance
  };
  return valuesObj;
}

export async function sendPayment(ether) {
  const web3 = await initWeb3();

  console.log(ether);

  const weiAmount = web3.utils.toWei(String(ether), "ether");
  console.log(weiAmount);
  const hexAmount = web3.utils.toHex(weiAmount);
  console.log(hexAmount);
  const back2Hex = web3.utils.hexToNumberString(hexAmount);
  console.log(back2Hex);

  const parameters = {
    to: address,
    from: ethereum.selectedAddress,
    value: hexAmount,
  };

  let txHash;
  try {
    txHash = await sendTx(parameters);
  } catch (e) {
    console.log(e.message);
    throw e;
  }
  return txHash;
}

export async function methodSender(method, arg) {
  const web3 = await initWeb3();
  const contract = await loadContract(web3);

  console.log(method, arg);

  let transaction;
  switch (method) {
    case "disperse":
      transaction = contract.methods.disperse().encodeABI();
      break;
    case "refund":
      transaction = contract.methods.refund().encodeABI();
      break;
    case "reset":
      transaction = contract.methods.reset().encodeABI();
      break;
    case "setMerchant":
      transaction = contract.methods.setMerchant(arg).encodeABI();
      break;
    case "markShipped":
      transaction = contract.methods.merchantMarkShipped().encodeABI();
      break;
    case "markReceived":
      transaction = contract.methods.clientMarkReceived().encodeABI();
  }

  const parameters = new RequestParameters(
    address,
    ethereum.selectedAddress,
    transaction
  );

  let txHash;
  try {
    txHash = await sendTx(parameters);
  } catch (e) {
    throw e;
  }
  return txHash;
}
