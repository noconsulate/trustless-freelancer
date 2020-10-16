const Web3 = require('web3');
const { setupLoader } = require('@openzeppelin/contract-loader');

const web3 = new Web3('http://localhost:8545');
// const loader = setupLoader({ 
//   provider: web3,
//   defaultGas: 50000,
//   defaultGasPrice: 1e6,
// }).web3;
const loader = setupLoader({provider: web3}).web3;

const address = '0x787e4651D8cf7CD91f4B3Ec29A9ECD0F5ca2af47';
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
  await freelancer.methods.setMerchant('0x57a074122A20a8e37485fa9d20574064572d93C9').send({
    from: accounts[1], gas: 5000000, gasPrice: 1e6,
  })

  await freelancer.methods.setMerchant('0x29d7C337265986eA74bd43581B79CcEa8479AB6B').send({
    from: accounts[2], gas: 5000000, gasPrice: 1e6,
  })



}

main();