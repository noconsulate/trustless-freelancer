const Web3 = require('web3');
const { setupLoader } = require('@openzeppelin/contract-loader');

const web3 = new Web3('http://localhost:8545');
// const loader = setupLoader({ 
//   provider: web3,
//   defaultGas: 50000,
//   defaultGasPrice: 1e6,
// }).web3;
const loader = setupLoader({provider: web3}).web3;

const address = '0x379804030b22bCCC2E4e72F6a1D478273626F0fB';
const freelancer = loader.fromArtifact('Freelancer', address)

// init contract with values for development
async function main() { 
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);

  // fund contract and set clients
  web3.eth.sendTransaction({
    from: accounts[1],
    to: address,
    value: web3.utils.toWei('.1', 'ether'),
  }).catch(console.log)
    .then(console.log
      
      )

  web3.eth.sendTransaction({
    from: accounts[2],
    to: address,
    value: web3.utils.toWei('.1', 'ether'),
  }).catch(console.log)

  // Set merchant 
  await freelancer.methods.setMerchant('0x8086A9dc79549d0363e324fe167289733D2d3798').send({
    from: accounts[1], gas: 5000000, gasPrice: 1e6,
  })

  await freelancer.methods.setMerchant('0x3fB71fB9ca3a4B5d7e6cbFa34E8997b6dbf29a57').send({
    from: accounts[4], gas: 5000000, gasPrice: 1e6,
  })



}

main();