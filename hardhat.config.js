require("@nomicfoundation/hardhat-ethers");
require("dotenv").config(); // Load .env variables

// Only deploying to Sepolia needs a wallet key. Compiling and running tests
// work without a .env file, so teammates can clone and run straight away.
const { SEPOLIA_RPC_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
};
