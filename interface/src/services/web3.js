const ENV_FLAG = 'local';
const DEBUG_FLAG = false;

import Web3 from "web3";
import Freelancer from "../../../contract/build/contracts/Freelancer.json"

let node_url, address;

if (ENV_FLAG == 'local') {
  node_url = 'http://127.0.0.1:8545';
  address = '0xdADbe13c556B31C9686d5189B4C86b7eC415CbD0'
}

let ethereum
if (typeof window.ethereum !== 'undefined') {
  ethereum = window.ethereum;
}

async function initWeb3() {
  const web3 = await new Web3(node_url)
  return web3;
}

async function loadContract(obj) {
  const contract = await new obj.eth.Contract(Freelancer.abi, address);
  return contract;
}

export async function doThing() {
  console.log('do a thing!');

  const resulty = await ethereum.selectedAddress;
  console.log(resulty);
}

export async function getAccount() {
  console.log('in getAccount()');

  ethereum.on('accountsChanged', function (accounts) {
    console.log('acocunt changed', accounts);
  });
  
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  console.log(accounts);
  return accounts[0];
};

export async function getValues() {
  const web3 = await initWeb3();
  const contract = await loadContract(web3);

  // to calibrate storage slots
  if (DEBUG_FLAG) {
    for (let index = 0; index < 7; index++) {
      const item = await web3.eth.getStorageAt(address, index);
      console.log(`[${index}]` + item);
    }
  }

  let admin, merchant, client, isShipped, isReceived

  // get values directly
  try {
    admin = await web3.eth.getStorageAt(address, 0);
    merchant = await web3.eth.getStorageAt(address, 1);
    client = await web3.eth.getStorageAt(address, 2);
  } catch (e) {
    console.log(e.message);
  }

  // get bools via getter because getStorageAt() wasn't working
  try {
    let flags = await contract.methods.getFlags().call({ from: null });
    console.log(flags);
    isShipped = flags[0];
    isReceived = flags[1];
  } catch (e) {
    console.log(e.message);
  }

  const valuesObj = {
    admin, merchant, client, isShipped, isReceived
  }
  console.log(valuesObj);
  return valuesObj;

};