const hre = require("hardhat");
var ethers = require("ethers");
ethers = hre.ethers

async function main() {
    // We get the contract to deploy
    const TestEVMSpace = await ethers.getContractFactory("TestEVMSpace");
    const t = await TestEVMSpace.attach("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0")

    await t.Call()
    let tx = await t.CreateAndRevert()
    await tx.wait()
    console.log('tx', tx)

    // await t.
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
