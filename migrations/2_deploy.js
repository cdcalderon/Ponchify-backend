const PonchyToken = artifacts.require("PonchyToken.sol");
const MasterChef = artifacts.require("MasterChef.sol");

module.exports = async function (deployer) {
  // Deploy Ponchy Token
  await deployer.deploy(PonchyToken, "Poncho Token", "PCHO");
  const ponchoToken = await PonchyToken.deployed();

  // Deploy Masterchef Contract
  await deployer.deploy(
    MasterChef,
    ponchoToken.address,
    process.env.DEV_ADDRESS, // Your address where you get ponchy tokens - should be a multisig
    web3.utils.toWei(process.env.TOKENS_PER_BLOCK), // Number of tokens rewarded per block, e.g., 100
    process.env.START_BLOCK, // Block number when token mining starts
    process.env.BONUS_END_BLOCK // Block when bonus ends
  );

  // Make Masterchef contract token owner
  const masterChef = await MasterChef.deployed();
  await ponchoToken.transferOwnership(masterChef.address);

  const lpAddresses = process.env.LP_TOKEN_ADDRESS || "";

  if (lpAddresses) {
    // Add Liquidity pool for rewards, e.g., "ETH/DAI Pool"
    for (const lpAddress of lpAddresses.split(",")) {
      await masterChef.add(process.env.ALLOCATION_POINT, lpAddress, false);
    }
  }

  console.log(
    "In frontend/src/ponchy/lib/constants.js scroll to CHAIN_ID 5 (if deployed on Goerli) or CHAIN_ID 97 (if deployed on bsc_testnet)"
  );
  console.log(
    `\nPaste this ${ponchoToken.address} into contractAddresses/ponchy`
  );
  console.log(
    `\nPaste this ${masterChef.address} into contractAddresses/masterChef`
  );

  // Carlos Notes:
  // Add more liquidity pools here upon deployment, or add them later manually
};
