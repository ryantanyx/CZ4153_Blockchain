const APIConsumer = artifacts.require("APIConsumer");


module.exports = async function (deployer) {
  await deployer.deploy(APIConsumer);
};
