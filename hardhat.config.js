require("@nomicfoundation/hardhat-ethers");
require("dotenv").config(); // Load .env variables

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL, // Use the .env variable
      accounts: [process.env.PRIVATE_KEY], // Use the .env variable
      chainId: 11155111,
    },
  },
};
