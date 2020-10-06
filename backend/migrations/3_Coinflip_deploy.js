const Coinflip = artifacts.require("Coinflip");

module.exports = function(deployer) {
    deployer.deploy(Coinflip);
  };