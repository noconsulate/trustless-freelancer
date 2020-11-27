const Freelancer = artifacts.require("Freelancer");
const Instantiator = artifacts.require("Instantiator");
const Ownable = artifacts.require("Ownable");
const ERC20 = artifacts.require("ERC20");

module.exports = function (instantiator) {
  // instantiator.deploy(
  //   Freelancer,
  //   "0x935A3dE3217D9BB58C24343600f655141d118aeB",
  //   "Webshits r us",
  //   "0xDdbfd4Bb2CFFfe0BEe18C5F11eDc22eFe6237266"
  // );
  instantiator.deploy(
    Instantiator,
    "0xaD6D458402F60fD3Bd25163575031ACDce07538D"
  );
};
