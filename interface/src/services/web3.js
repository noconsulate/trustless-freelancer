const ENV_FLAG = 'local';

import Web3 from "web3";
import Freelancer from "../../../contract/build/contracts/Freelancer.json"

let node_url, address;

if (ENV_FLAG == 'locaal') {
  node_url = 'http://127.0.0.1:7574';
  address = '0xf18851ceEf2C8d6Bb868db3efD1f43BC9B2042A1'
}

let ethereum
if (typeof window.ethereum !== 'undefined') {
  ethereum = window.ethereum;
}

async function initWeb3() {
  const web3 = await new Web3(node_url)
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

  let valuesObj, response;
  try {
    const contract = await loadContract(web3);

  } catch (e) {
    console.log(e.message);
  }
};