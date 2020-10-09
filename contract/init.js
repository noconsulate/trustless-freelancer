const Web3 = require('web3');
const { setupLoader } = require('@openzeppelin/contract-loader');

console.log(process.env.LOCAL_CONTRACT);

const web3 = new Web3('http://localhost:8545');
// const loader = setupLoader({ 
//   provider: web3,
//   defaultGas: 50000,
//   defaultGasPrice: 1e6,
// }).web3;
const loader = setupLoader({provider: web3}).web3;

const address = '0x797b99ac73F6b5D980fc0685756Cf0e1Bfe564C0';
console.log(process.env.LOCAL_CONTRACT);
const freelancer = loader.fromArtifact('Freelancer', address)

// init contract with values for development
async function main() { 
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);

  // fund contract and set client
  web3.eth.sendTransaction({
    from: accounts[1],
    to: address,
    value: web3.utils.toWei('.1', 'ether'),
  }).catch(console.log)

  // Set merchant 
  await freelancer.methods.setMerchant('0x83316a84d99c1232d0A596AA95c7dd1F488a3952').send({
    from: accounts[0], gas: 5000000, gasPrice: 1e6,
  })



}

main();