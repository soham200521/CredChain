// scripts/deploy.js

async function main() {
    // Get the contract factory
    const CredChain = await ethers.getContractFactory("CredChain");
    
    // Deploy the contract
    console.log("Deploying CredChain...");
    const credChain = await CredChain.deploy();
    
    // Wait for deployment to finish
    await credChain.waitForDeployment();
    
    // Get the contract address
    const address = await credChain.getAddress();
    console.log("CredChain deployed to:", address);
  }
  
  // Execute the deployment
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  