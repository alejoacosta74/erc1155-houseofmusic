require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

// remove any quotes and '0x' from the env REACT_APP_PRIVATE_KEY
const privateKey = process.env.REACT_APP_PRIVATE_KEY.replace(/['"]+/g, '').replace('0x', '');
const ganacheURL = `http://localhost:${process.env.GANACHE_PORT}`;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  let i=0;

  for (const account of accounts) {
    console.log(`account #${i}: `,account.address);
    i++;
  }
});

module.exports = {
  defaultNetwork: "ganache",
  networks: {
    ganache: {
      url: ganacheURL,
      accounts: [privateKey],
      chainId: 1337
    },
    hardhat: {
      chainId: 1337,
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};