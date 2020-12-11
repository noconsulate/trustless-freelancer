const ENV_FLAG = "ropsten";

import Web3 from "web3";
import awaitTransactionMined from "await-transaction-mined";
import Freelancer from "../../../contract/build/contracts/Freelancer.json";
import Instantiator from "../../../contract/build/contracts/Instantiator.json";

let instantiatorAddress;
switch (ENV_FLAG) {
  case "local":
    instantiatorAddress = "0xbd4EDDf5e509Fa5450D1bb7664E8Ebfcf9E205E2";
    break;
  case "ropsten":
    instantiatorAddress = "0x69aDBC0F6ad999100D57747DF8A1A2319Fa514Ba";
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
  const web3 = new Web3(window.ethereum);
  return web3;
}

async function loadContract(obj, address) {
  const contract = await new obj.eth.Contract(Freelancer.abi, address);
  return contract;
}

async function loadInstantiator(obj) {
  const instantiator = await new obj.eth.Contract(
    Instantiator.abi,
    instantiatorAddress
  );
  return instantiator;
}

// returns when tx has confirmed
export async function awaitTxMined(txHash) {
  console.log("awaitTxMined()", txHash);
  const web3 = await initWeb3();

  let receipt;
  try {
    receipt = await awaitTransactionMined.awaitTx(web3, txHash, {
      blocksToWait: 1,
    });
    console.log("confirmation received");
  } catch (e) {
    console.log(e);
  }

  return receipt;
}

export async function getClients(address) {
  const web3 = await initWeb3();
  const contract = await loadContract(web3, address);

  let clients;

  try {
    clients = await contract.methods.getClients().call({ from: null });
  } catch (e) {
    throw e;
  }

  // filter zerod out addresses because how solidity behaves
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
    console.log("tx sent", txHash);
  } catch (e) {
    console.log(e.message);
    throw e;
  }

  return txHash;
}

export async function getEscrowValues(client, contractAddress) {
  const web3 = await initWeb3();
  const contract = await loadContract(web3, contractAddress);

  let name, balance, isShipped, endTime, term, recurring;

  try {
    let values = await contract.methods
      .getEscrowValues(client)
      .call({ from: null });

    name = values[0];
    balance = values[1];
    isShipped = values[2];
    endTime = values[3];
    term = values[4];
    recurring = values[5];
  } catch (e) {
    console.log(e.message);
    throw e;
  }

  // convert crazy token values (should depend on token)
  // balance = web3.utils.fromWei(balance, "ether");

  const valuesObj = {
    name,
    balance,
    isShipped,
    endTime,
    term,
    recurring,
  };

  return valuesObj;
}

export async function getContract() {
  const web3 = await initWeb3();
  const instantiator = await loadInstantiator(web3);

  let freelancerAddress;

  try {
    freelancerAddress = await instantiator.methods.getContract().call({
      from: window.ethereum.selectedAddress,
    });
  } catch (e) {
    console.log("error in getContract()", e.message);
    throw e.code;
  }

  return freelancerAddress;
}

export async function getValues(address) {
  const web3 = await initWeb3();
  const contract = await loadContract(web3, address);

  let owner, balance, name, serviceFee;

  try {
    owner = await contract.methods.owner().call({ from: null });
  } catch (e) {
    console.log("error in values fetch", e.message);
    throw e.code;
  }

  try {
    name = await contract.methods.getName().call({ from: null });
  } catch (e) {
    console.log("error in values fetch", e.message);
    throw e.code;
  }

  try {
    balance = await contract.methods.total().call({ from: null });
  } catch (e) {
    console.log(e);
    throw e.code;
  }

  const valuesObj = {
    name,
    owner,
    balance,
  };
  return valuesObj;
}

export async function sendPayment(ether, contractAddress) {
  const web3 = await initWeb3();
  // const address = freelancerAddress;

  console.log(ether);

  const weiAmount = web3.utils.toWei(String(ether), "ether");
  console.log(weiAmount);
  const hexAmount = web3.utils.toHex(weiAmount);
  console.log(hexAmount);
  const back2Hex = web3.utils.hexToNumberString(hexAmount);
  console.log(back2Hex);

  const parameters = {
    to: contractAddress,
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

export async function deploy(name, fee) {
  const web3 = await initWeb3();
  const instantiator = await loadInstantiator(web3);

  const transaction = instantiator.methods.deploy(name, fee).encodeABI();

  const parameters = new RequestParameters(
    instantiatorAddress,
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

export async function methodSender(method, arg, contractAddress) {
  const web3 = await initWeb3();
  const contract = await loadContract(web3, contractAddress);

  console.log(method, arg, contractAddress);

  let transaction, address;
  switch (method) {
    // need "preTrnsferFrom"
    case "transferFrom":
      const { tokenAmount, clientName, termLength, recurring } = arg;
      // const weiAmount = web3.utils.toWei(String(tokenAmount), "ether");
      console.log("sendToken: " + tokenAmount, clientName);
      transaction = contract.methods
        .sendToken(tokenAmount, clientName, termLength, recurring)
        .encodeABI();
      address = contractAddress;
      break;
    case "refund":
      transaction = contract.methods.refund(arg).encodeABI();
      address = contractAddress;
      break;
    case "cancel":
      transaction = contract.methods.cancelRecurring(arg).encodeABI();
      address = contractAddress;
      break;
    case "reset":
      transaction = contract.methods.reset().encodeABI();
      address = contractAddress;
      break;
    case "markShipped":
      transaction = contract.methods.markShipped(arg).encodeABI();
      address = contractAddress;
      break;
    case "disperse":
      console.log("got it");
      transaction = contract.methods.termElapsed(arg).encodeABI();
      address = contractAddress;
      break;
    default:
      console.log("no matching method");
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
