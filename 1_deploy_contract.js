const PressVote = artifacts.require("PressVote");

module.exports = function (deployer) {
  return deployer.deploy(PressVote);
};