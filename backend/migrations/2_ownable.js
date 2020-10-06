const Ownable = artifacts.require("Ownable");

module.exports = function(deployer) {
  deployer.deploy(Ownable);
};
