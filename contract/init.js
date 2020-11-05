//initiate Freelancer.sol with values for developing

const Web3 = require("web3");
const { setupLoader } = require("@openzeppelin/contract-loader");

const { freelancerAddress, tokenAddress } = require("../address");

import Freelancer from "./build/contracts/Freelancer.json";
import IERC20 from "./build/contracts/IERC20.json";

const web3 = new Web3("http://localhost:8545");
// const loader = setupLoader({
//   provider: web3,
//   defaultGas: 50000,
//   defaultGasPrice: 1e6,
// }).web3;
const loader = setupLoader({ provider: web3 }).web3;

const freelancer = loader.fromArtifact("Freelancer", freelancerAddress);
const token = loader.fromArtifact("IERC20", tokenAddress);
let accounts, log;

// init contract with values for development
async function main() {
  accounts = await web3.eth.getAccounts();
  console.log(accounts);

  let balance = token.balanceOf(accounts[0]);
  console.log(balance);
}

main();
