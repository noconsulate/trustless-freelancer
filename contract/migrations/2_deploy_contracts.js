const Freelancer = artifacts.require("Freelancer");
const Instantiator = artifacts.require("Instantiator");
const Ownable = artifacts.require("Ownable");
const ERC20 = artifacts.require("ERC20");

// local token 0xDdbfd4Bb2CFFfe0BEe18C5F11eDc22eFe6237266
// ropsten DAI 0xaD6D458402F60fD3Bd25163575031ACDce07538D
module.exports = function (deployer) {
  deployer.deploy(
    Freelancer,
    "0x935A3dE3217D9BB58C24343600f655141d118aeB",
    "Webshits r us",
    "0xDdbfd4Bb2CFFfe0BEe18C5F11eDc22eFe6237266",
    3,
    "0x935A3dE3217D9BB58C24343600f655141d118aeB"
  );
  deployer.deploy(Instantiator, "0xDdbfd4Bb2CFFfe0BEe18C5F11eDc22eFe6237266");
};
