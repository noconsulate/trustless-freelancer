//initiate Freelancer.sol with values for developing

const Web3 = require("web3");
const contract = require("@truffle/contract");

const FreelancerABI = require("./build/contracts/Freelancer.json");
const TokenABI = require("./build/contracts/ERC20.json");

const freelancerAddress = "0x6167cD85365d962CDe0C00a551c25439499117B0";
const tokenAddress = "0xDdbfd4Bb2CFFfe0BEe18C5F11eDc22eFe6237266";

const web3 = new Web3("http://localhost:8545");
const provider = new Web3.providers.HttpProvider("http://localhost:8545");

const Freelancer = contract(FreelancerABI);
Freelancer.setProvider(provider);

const Token = contract(TokenABI);
Token.setProvider(provider);

let accounts, freelancer, token;

let res;

// init contract with values for development
async function main() {
  freelancer = await Freelancer.at(freelancerAddress);
  token = await Token.at(tokenAddress);

  accounts = await web3.eth.getAccounts();

  res = await freelancer.reset({ from: accounts[0] });

  res = await token.approve(freelancerAddress, 10000, { from: accounts[1] });
  console.log(res);

  res = await freelancer.sendToken(10000, "Jim Jennings", 2, {
    from: accounts[1],
  });
  console.log(res.logs);

  res = await token.approve(freelancerAddress, 35000, { from: accounts[2] });
  console.log(res);

  res = await freelancer.sendToken(10000, "Peter Griffin", 3, {
    from: accounts[2],
  });
  console.log(res.logs);

  // res = await freelancer.markShipped(accounts[1], { from: accounts[0] });
  // console.log(res);

  // res = await freelancer.markReceived({ from: accounts[1] });
  // console.log(res);

  return;
}

main();

return;
