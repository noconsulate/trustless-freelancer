const ENV_FLAG = "local";
const DEBUG_FLAG = false;

import Web3 from "web3";
import awaitTransactionMined from "await-transaction-mined";
import Freelancer from "../../../contract/build/contracts/Freelancer.json";
import Deployer from "../../../contract/build/contracts/Deployer.json";

import { freelancerAddress, deployerAddress } from '../../../address'
let node_url

// if (ENV_FLAG == "local") {
//   node_url = "http://127.0.0.1:8545";
//   address = "0xb800a700885A0d2191A45ED8594a4a1ff4e9507F";
// }

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
  return web3;
}

async function loadContract(obj) {
  const contract = await new obj.eth.Contract(Freelancer.abi, freelancerAddress);
  return contract;
}

async function loadDeployer(obj) {
  const deployer = await new obj.eth.Contract(Deployer.abi, deployerAddress);
  return deployer;
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

  let clients;

  try {
    clients = await contract.methods.getClients().call({ from: null });
  } catch (e) {
    throw e;
  }

  // filter zerod out addresses
  const hexZero = "0x0000000000000000000000000000000000000000";
  clients = clients.filter((item) => item != hexZero);

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
    let values = await contract.methods
      .getEscrowValues(client)
      .call({ from: null });

    balance = values[0];
    isShipped = values[1];
    isReceived = values[2];
  } catch (e) {
    console.log(e.message);
    throw e;
  }

  balance = web3.utils.fromWei(balance, "ether");

  const valuesObj = { balance, isShipped, isReceived };

  return valuesObj;
}

export async function getContract() {
  const web3 = await initWeb3();
  const deployer = await loadDeployer(web3);

  console.log(window.ethereum.selectedAddress)
  let freelancerAddress;

  try {
    freelancerAddress = await deployer.methods.getContract().call({
      from: window.ethereum.selectedAddress
    });
  } catch (e) {
    console.log('error in getContract()', e.message);
    throw e.code;
  }

  console.log(freelancerAddress)
  return freelancerAddress;
}

export async function getValues() {
  const web3 = await initWeb3();
  const contract = await loadContract(web3);

  const address = freelancerAddress;

  let owner, balance;

  try {
    owner = await contract.methods.getOwner().call({ from: null });
  } catch (e) {
    console.log("error in values fetch", e.message);
    throw e.code;
  }

  balance = await web3.eth.getBalance(address);
  balance = web3.utils.fromWei(balance, "ether");

  const valuesObj = {
    address,
    owner,
    balance,
  };
  return valuesObj;
}

export async function sendPayment(ether) {
  const web3 = await initWeb3();
  const address = freelancerAddress;

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
  const deployer = await loadDeployer(web3);

  console.log(method, arg);

  let transaction, address;
  switch (method) {
    case "refund":
      transaction = contract.methods.refund(arg).encodeABI();
      address = freelancerAddress;
      break;
    case "reset":
      transaction = contract.methods.reset().encodeABI();
      address = freelancerAddress;
      break;
    case "markShipped":
      transaction = contract.methods.markShipped(arg).encodeABI();
      address = freelancerAddress;
      break;
    case "markReceived":
      transaction = contract.methods.markReceived().encodeABI();
      address = freelancerAddress;
      break;
    case "deploy":
      transaction = deployer.methods.deploy().encodeABI();
      address = deployerAddress;
      break;
    default:
      console.log('no matching method');
      return;
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
