const Web3 = require('web3');
const { setupLoader } = require('@openzeppelin/contract-loader');

const web3 = new Web3('http://localhost:8545');
const loader = setupLoader({ provider: web3 }).web3;

const address = '0x797b99ac73F6b5D980fc0685756Cf0e1Bfe564C0';
const freelancer = loader.fromArtifact('Freelancer', address)

// init contract with values for development
async function main() { 
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);

  await freelancer.methods.setMerchant('0xb8dC500be5cfEc13E4255aa6334A7051f47C6474').send({
    from: accounts[0],
    gas: 50000,
    gasPrice: 1e6,
  })

  await freelancer.methods.clientMarkReceived().send({
    from: accounts[1],
    gas: 50000,
    gasPrice: 1e6, 
  });

}

main();