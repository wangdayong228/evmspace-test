const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const TestEVMSpace = await hre.ethers.getContractFactory("TestEVMSpace");
  const testEvmspace = await TestEVMSpace.deploy();

  await testEvmspace.deployed();
  console.log("TestEVMSpace deployed to:", testEvmspace.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
