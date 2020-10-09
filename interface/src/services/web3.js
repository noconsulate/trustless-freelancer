const ENV_FLAG = 'local';

import Web3 from "web3";
import Freelancer from "../../../contract/build/contracts/Freelancer.json"

let node_url, address;

if (ENV_FLAG == 'local') {
  node_url = 'http://127.0.0.1:8545';
  address = '0x797b99ac73F6b5D980fc0685756Cf0e1Bfe564C0'
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

  let admin, merchant, client, isShipped, isReceived
  try {
    admin = await web3.eth.getStorageAt(address, 0);
    console.log(admin);
    // const asAscii = web3.utils.hexToNumber(admin);
    // console.log(asAscii);
    merchant = await web3.eth.getStorageAt(address, 1);
    client = await web3.eth.getStorageAt(address, 2);
    console.log(client);
    isShipped = await web3.eth.getStorageAt(address, 3);
    isReceived = await web3.eth.getStorageAt(address, 4);
  } catch (e) {
    console.log(e.message);
  }
  console.log(admin);

  const valuesObj = {
    admin, merchant, client, isShipped, isReceived
  }
  console.log(valuesObj);
  return valuesObj;

};