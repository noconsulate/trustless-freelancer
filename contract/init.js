const Web3 = require('web3');
const { setupLoader } = require('@openzeppelin/contract-loader');

const web3 = new Web3('http://localhost:8545');
// const loader = setupLoader({ 
//   provider: web3,
//   defaultGas: 50000,
//   defaultGasPrice: 1e6,
// }).web3;
const loader = setupLoader({provider: web3}).web3;

const address = '0xc295335Db272BEF6219Da27F5D1AA18F6C972E50';
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
  await freelancer.methods.setMerchant('0xe941145418C60A84D98c0e9C181fd19c77f609C2').send({
    from: accounts[1], gas: 5000000, gasPrice: 1e6,
  })

  await freelancer.methods.setMerchant('0x8086A9dc79549d0363e324fe167289733D2d3798').send({
    from: accounts[2], gas: 5000000, gasPrice: 1e6,
  })



}

main();