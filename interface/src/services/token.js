import Web3 from "web3";

import FreelancerToken from "./FreelancerTOKEN.json";

import { tokenAddress } from "../../../address";

const ethereum = window.ethereum;

async function initWeb3() {
  const web3 = new Web3(window.ethereum);
  return web3;
}

async function loadContract(obj) {
  const contract = await new obj.eth.Contract(
    FreelancerToken.abi,
    tokenAddress
  );
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

export async function sendApprove(freelancerAddress, value) {
  console.log(
    "sendApprove",
    "freelancer:" + freelancerAddress,
    "value:" + value,
    "selectedAddress" + ethereum.selectedAddress
  );

  const web3 = await initWeb3();
  const contract = await loadContract(web3);

  const weiAmount = web3.utils.toWei(String(value), "ether");
  const hexAmount = web3.utils.toHex(weiAmount);
  console.log(weiAmount);

  const stringNum = "1000000000";
  const transaction = contract.methods
    .approve(freelancerAddress, weiAmount)
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
