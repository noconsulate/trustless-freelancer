const ENV_FLAG = 'local';

import Web3 from "web3";
import Freelancer from "../../../contract/build/contracts/Freelancer.json"

let node_url, address;

if (ENV_FLAG == 'locaal') {
  node_url = 'http://127.0.0.1:7574';
  address = '0x8952e529dA0013e2D3e3C4349C5986A9BCCC9Cb7'
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

  let accounts;
  accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  console.log(accounts);
}

export async function getAccount() {
  console.log('in getAccount()');
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  console.log(accounts);
  return accounts[0];
}