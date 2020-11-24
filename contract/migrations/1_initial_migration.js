const Migrations = artifacts.require("Migrations");

module.exports = function (instantiator) {
  instantiator.deploy(Migrations);
};
