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
   address = "0x2c4c6d5941af4D3e7845667B6e8C9A2f844bACDa";
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
