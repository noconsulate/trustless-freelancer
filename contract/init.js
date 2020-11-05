//initiate Freelancer.sol with values for developing

const Web3 = require("web3");
const contract = require("@truffle/contract");

const FreelancerABI = require("./build/contracts/Freelancer.json");
const TokenABI = require("./build/contracts/ERC20.json");

const web3 = new Web3("http://localhost:8545");

const Freelancer = contract(FreelancerABI);
Freelancer.setProvider(web3);
// Token.setProvider(web3);

let accounts, freelancer, token;

let res;

Freelancer.at(freelancerAddress).then(function (instance) {
  freelancer = instance;
});

// init contract with values for development
async function main() {
  accounts = await web3.eth.getAccounts();
  console.log(accounts);

  freelancer = await Freelancer.at(freelancerAddress);
  token = await Token.at(tokenAddress);

  res = await freelancer.getClients();
  console.log(res);

  // const token = await loader.fromArtifact("IERC20", tokenAddress);
  // const freelancer = await Freelancer.deploy(
  //   accounts[0],
  //   "0xDdbfd4Bb2CFFfe0BEe18C5F11eDc22eFe6237266"
  // ).send();

  // let balance = await token.methods.balanceOf(accounts[0]).call();
  // console.log(balance);

  // await freelancer.methods.reset().send();
  // const foobutt = await freelancer.methods.getEscrowValues(accounts[0]).send();
  // console.log(foobutt);

  // waiter = await token.methods
  //   .approve(freelancerAddress, 50000)
  //   .send({ from: accounts[1] });
  // console.log("approve returned");

  // waiter = await freelancer.methods.sendToken(5000).send({ from: accounts[1] });
  // console.log(waiter);
}

main();
