//initiate Freelancer.sol with values for developing

const Web3 = require("web3");
const { setupLoader } = require("@openzeppelin/contract-loader");

const { tokenAddress } = require("../address");
const freelancerAddress = "0x9BC228aeB85EB5619eDf33e5b8C9D867c255a50e";

const web3 = new Web3("http://localhost:8545");

const loader = setupLoader({
  provider: web3,
  defaultSender: "0x935A3dE3217D9BB58C24343600f655141d118aeB",
}).web3;

//const freelancer = loader.fromArtifact("Freelancer", freelancerAddress);

const Freelancer = loader.fromArtifact("Freelancer");

let accounts, log, waiter;

// init contract with values for development
async function main() {
  accounts = await web3.eth.getAccounts();
  console.log(accounts);

  const token = await loader.fromArtifact("IERC20", tokenAddress);
  const freelancer = await Freelancer.deploy(
    accounts[0],
    "0xDdbfd4Bb2CFFfe0BEe18C5F11eDc22eFe6237266"
  ).send();

  let balance = await token.methods.balanceOf(accounts[0]).call();
  console.log(balance);

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
