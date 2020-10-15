const ENV_FLAG = "local";
const DEBUG_FLAG = false;

import Web3 from "web3";
import awaitTransactionMined from "await-transaction-mined";
import Freelancer from "../../../contract/build/contracts/Freelancer.json";

let node_url, address;

if (ENV_FLAG == "local") {
  node_url = "http://127.0.0.1:8545";
  address = "0xfaCa89681DaEC0c68b7cbdB8A5DDC4F04Eb20cd8";
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
  return web3;
}

async function loadContract(obj) {
  const contract = await new obj.eth.Contract(Freelancer.abi, address);
  return contract;
}

export async function awaitTxMined(txHash) {
  console.log('awaitTxMined()', txHash);
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

export async function getAccount() {
  let accounts;

  try {
    accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log(accounts);
  } catch (e) {
    console.log(e.message);
  }

  return accounts[0];
}

async function sendTx(parameters) {
  let txHash;
  try {
    txHash = await ethereum.request({
      method: "eth_sendTransaction",
      params: [parameters],
    });
  } catch (e) {
    console.log(e.message);
    throw e;
  }

  return txHash;
}

export async function getValues() {
  const web3 = await initWeb3();
  //temporary
  window.myWeb3 = web3;
  const contract = await loadContract(web3);

  let admin, merchant, client, isShipped, isReceived, balance;

  try {
    let values = await contract.methods.getValues().call({ from: null });

    admin = values[0];
    merchant = values[1];
    client = values[2];
    isShipped = values[3];
    isReceived = values[4];

    let wei = await web3.eth.getBalance(address);
    balance = web3.utils.fromWei(wei, "ether");
  } catch (e) {
    console.log("error in values fetch", e.message);
    throw e.code;
  }

  const valuesObj = {
    address,
    admin,
    merchant,
    client,
    isShipped,
    isReceived,
    balance,
  };
  return valuesObj;
}

export async function reset() {
  const web3 = await initWeb3();
  //temp
  window.myWeb3 = web3;
  const contract = await loadContract(web3);

  const transaction = contract.methods.reset().encodeABI();
  const parameters = new RequestParameters(
    address,
    ethereum.selectedAddress,
    transaction
  );

  let txHash;
  try {
    txHash = await sendTx(parameters);
    console.log("txHash from reset()", txHash);
  } catch (e) {
    throw e;
  }

  return txHash;
}

export async function markShipped() {
  const web3 = await initWeb3();
  const contract = await loadContract(web3);

  const transaction = contract.methods.merchantMarkShipped().encodeABI();
  const parameters = new RequestParameters(
    address,
    ethereum.selectedAddress,
    transaction
  );

  let txHash;
  try {
    txHash = await sendTx(parameters);
  } catch (e) {
    console.log(e.code);
    throw e;
  }
  return txHash;
}

export async function markReceived() {
  const web3 = await initWeb3();
  const contract = await loadContract(web3);
  console.log("markReceived()", contract);

  const transaction = contract.methods.clientMarkReceived().encodeABI();
  const parameters = new RequestParameters(
    address,
    ethereum.selectedAddress,
    transaction
  );

  let txHash;
  try {
    txHash = await sendTx(parameters);
  } catch (e) {
    console.log(e.code);
    throw e;
  }
  return txHash;
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

export async function setMerchant(merchant) {
  const web3 = await initWeb3();
  const contract = await loadContract(web3);

  const transaction = contract.methods.setMerchant(merchant).encodeABI();
  const parameters = new RequestParameters(address, ethereum.selectedAddress, transaction);

  let txHash;
  try {
    txHash = await sendTx(parameters);
  } catch (e) {
    console.log(e.code);
    throw e;
  } 
  return txHash;
}

export async function methodSender(method) {
  const web3 = await initWeb3();
  const contract = await loadContract(web3);

  let transaction;
  switch (method) {
    case 'disperse':
      transaction = contract.methods.disperse().encodeABI();
      break;
    case 'refund':
      transaction = contract.methods.refund().encodeABI();
  }

  const parameters = new RequestParameters(address, ethereum.selectedAddress, transaction);

  let txHash;
  try {
    txHash = await sendTx(parameters);
  } catch (e) {
    throw e;
  }
  return txHash;
}
