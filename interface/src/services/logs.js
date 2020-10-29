const ENV_FLAG = "local";
const DEBUG_FLAG = false;

import Web3 from "web3";
import awaitTransactionMined from "await-transaction-mined";
import Freelancer from "../../../contract/build/contracts/Freelancer.json";

import { address } from "../../../address";

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

async function initWeb3() {
  const web3 = await new Web3(window.ethereum);
  return web3;
}

async function loadContract(obj, address) {
  const contract = await new obj.eth.Contract(Freelancer.abi, address);
  return contract;
}

export async function getLogs(address) {
  const web3 = await initWeb3();
  const contract = await loadContract(web3, address);

  const depositLogs = await contract.getPastEvents("Deposit", {
    filter: {},
    fromBlock: 0,
    toBlock: "latest",
  });

  let depositsReadable = [];
  depositLogs.map((log) => {
    const client = log.returnValues._client;
    const value = web3.utils.fromWei(log.returnValues._value, "ether");
    const block = log.blockNumber;

    depositsReadable.push({ client, value, block });
  });

  let refundLogs = await contract.getPastEvents("Refund", {
    filter: {},
    fromBlock: 0,
    toBlock: "latest",
  });

  let refundsReadable = [];
  refundLogs.map((log) => {
    const client = log.returnValues._client;
    const value = web3.utils.fromWei(log.returnValues._value, "ether");
    const block = log.blockNumber;

    refundsReadable.push({ client, value, block });
  });

  let disperseLogs = await contract.getPastEvents("Disperse", {
    filter: {},
    fromBlock: 0,
    toBlock: "latest",
  });

  let disperseReadable = [];
  disperseLogs.map((log) => {
    const client = log.returnValues._client;
    const value = web3.utils.fromWei(log.returnValues._value, "ether");
    const block = log.blockNumber;

    disperseReadable.push({ client, value, block });
  });

  return { depositsReadable, refundsReadable, disperseReadable };
}
