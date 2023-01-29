const PonchyToken = artifacts.require("PonchyToken");
const MasterChef = artifacts.require("MasterChef");

/* Only for BSC testnet ! */

module.exports = async (done) => {
  try {
    const masterChef = await MasterChef.deployed();
    console.log("MasterChef fetched", masterChef.address);
  } catch (error) {
    console.log(error);
  }
  done();
};
