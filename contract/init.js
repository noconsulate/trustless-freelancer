//initiate Freelancer.sol with values for developing

const Web3 = require("web3");
const { setupLoader } = require("@openzeppelin/contract-loader");

const web3 = new Web3("http://localhost:8545");
// const loader = setupLoader({
//   provider: web3,
//   defaultGas: 50000,
//   defaultGasPrice: 1e6,
// }).web3;
const loader = setupLoader({ provider: web3 }).web3;

let address 
if (address == undefined) {
   address = "0xb800a700885A0d2191A45ED8594a4a1ff4e9507F";
}
const freelancer = loader.fromArtifact("Freelancer", address);
let accounts;

// init contract with values for development
async function main() {
  accounts = await web3.eth.getAccounts();
  console.log(accounts);

  // fund contract and set clients
  web3.eth
    .sendTransaction({
      from: accounts[1],
      to: address,
      value: web3.utils.toWei(".1", "ether"),
    })
    .catch(console.log)
    .then(console.log);

  web3.eth
    .sendTransaction({
      from: accounts[2],
      to: address,
      value: web3.utils.toWei(".1", "ether"),
    })
    .catch(console.log);

  
}

main();

      // **TOOLS FOR PLAYING IN NODE**
function sendEth(acct) {
  web3.eth
  .sendTransaction({
    from: acct,
    to: address,
    value: web3.utils.toWei(".1", "ether"),
  })
  .catch(console.log)
  .then(res => console.log(res));
}

function getLog() {
  freelancer.getPastEvents('Deposit', {
    filter: {},
    fromBlock: 0,
    toBlock: 'latest',
  }, function(error, events) {console.log(events); })
    .then(events => console.log(events));
}

 // await freelancer.methods.setMerchant('0x3fB71fB9ca3a4B5d7e6cbFa34E8997b6dbf29a57').send({
  //   from: accounts[2], gas: 5000000, gasPrice: 1e6,
  // })