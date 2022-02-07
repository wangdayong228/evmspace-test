require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});



// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "hardhatout",
  networks: {
    ganache: {
      url: "http://localhost:7545",
    },
    hardhatout: {
      url: "http://localhost:8545",
    },
    gethprivate: {
      url: "http://localhost:9545",
      accounts: ['7838BF35006145CB50B28EE9CB69C8757B71AD302FF330D163932702B63F7103'],
    },
    evmconflux: {
      url: "http://net8889eth.confluxrpc.com",
      accounts: ['0b56f3db5a57e57aa8ac44f0c4aecafe2db1643f302a6d634cf486ee774725bb',
      ]
    },
    evmconfluxtest: {
      url: "https://evmtestnet.confluxrpc.com",
      accounts: ['0b56f3db5a57e57aa8ac44f0c4aecafe2db1643f302a6d634cf486ee774725bb',
      ]
    },
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/123abc123abc123abc123abc123abcde",
    }
  },
  mocha: {
    timeout: 400000
  }
};
