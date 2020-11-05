const Freelancer = artifacts.require("Freelancer");
const Ownable = artifacts.require("Ownable");
const ERC20 = artifacts.require("ERC20");

module.exports = function (deployer) {
  deployer.deploy(
    Freelancer,
    "0x935A3dE3217D9BB58C24343600f655141d118aeB",
    "0xDdbfd4Bb2CFFfe0BEe18C5F11eDc22eFe6237266"
  );
};