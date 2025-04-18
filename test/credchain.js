const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CredChain", function () {
  let CredChain, credChain, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // NEW SYNTAX: Use deployContract instead of getContractFactory + deploy
    CredChain = await ethers.getContractFactory("CredChain");
    credChain = await CredChain.deploy();
    await credChain.waitForDeployment(); // Replace .deployed() with waitForDeployment()
  });

  it("Should deploy and set the deployer as the owner", async function () {
    expect(await credChain.owner()).to.equal(owner.address);
  });

  // Rest of your tests remain the same...
});
