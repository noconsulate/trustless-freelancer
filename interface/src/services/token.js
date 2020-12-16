const ENV = "local";

import Web3 from "web3";

import FreelancerToken from "./FreelancerTOKEN.json";

import ERC20 from "../assets/ERC20.json";

let tokenAddress;
if (ENV == "local") {
  tokenAddress = "0xDdbfd4Bb2CFFfe0BEe18C5F11eDc22eFe6237266";
}
if (ENV == "ropsten") {
  tokenAddress = "0xaD6D458402F60fD3Bd25163575031ACDce07538D";
}

const ethereum = window.ethereum;

async function initWeb3() {
  const web3 = new Web3(window.ethereum);
  return web3;
}

async function loadContract(obj) {
  const contract = await new obj.eth.Contract(ERC20.abi, tokenAddress);
  return contract;
}

class RequestParameters {
  constructor(to, from, data) {
    this.to = to;
    this.from = from;
    this.data = data;
  }
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

export async function checkBalance(client) {
  const web3 = await initWeb3();
  const contract = await loadContract(web3);
  console.log(client, tokenAddress);
  let balance;
  try {
    balance = await contract.methods.balanceOf(client).call({ from: null });
  } catch (e) {
    console.log(e);
    throw e;
  }

  // balance = web3.utils.fromWei(balance, "ether");

  return balance;
}

export async function checkAllowance(spender) {
  const web3 = await initWeb3();
  const contract = await loadContract(web3);

  const owner = window.ethereum.selectedAddress;

  let allowance;
  try {
    allowance = await contract.methods.allowance(owner, spender).call();
  } catch (e) {
    console.log(e);
    throw e;
  }

  // allowance = web3.utils.fromWei(allowance.toString(), "ether");
  return allowance;
}

// what's this doing here??
export async function getClients(address) {
  const web3 = await initWeb3();
  const contract = await loadContract(web3, address);

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

export async function sendApprove(freelancerAddress, value) {
  console.log(
    "sendApprove",
    "spender: " + freelancerAddress,
    "value: " + value,
    "from: " + ethereum.selectedAddress
  );

  const web3 = await initWeb3();
  const contract = await loadContract(web3);

  // const weiAmount = web3.utils.toWei(String(value), "ether");
  // const hexAmount = web3.utils.toHex(weiAmount);
  // console.log(weiAmount);

  // const stringNum = "1000000000";
  const transaction = contract.methods
    .approve(freelancerAddress, value)
    .encodeABI();

  const parameters = new RequestParameters(
    tokenAddress,
    window.ethereum.selectedAddress,
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

export async function sendTokens(amount, freelancerAddress) {
  console.log("sendTokens", amount, freelancerAddress);

  const web3 = await initWeb3();
  const contract = await loadContract(web3);

  const weiAmount = web3.utils.toWei(String(amount), "ether");
  console.log(weiAmount);

  const transaction = contract.methods
    .transfer(freelancerAddress, weiAmount)
    .encodeABI();

  console.log(transaction);

  const parameters = new RequestParameters(
    tokenAddress,
    window.ethereum.selectedAddress,
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
