const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying SimpleTreasuryDAO...");

  // Deploy with minDepositToVote = 0.001 ETH (in wei)
  const minDeposit = hre.ethers.parseEther("0.001");

  const SimpleTreasuryDAO = await hre.ethers.getContractFactory("SimpleTreasuryDAO");
  const dao = await SimpleTreasuryDAO.deploy(minDeposit);

  await dao.waitForDeployment();
  const address = await dao.getAddress();

  console.log("✅ SimpleTreasuryDAO deployed to:", address);
  console.log("   Min deposit to vote:", hre.ethers.formatEther(minDeposit), "ETH");

  // Save deployment info
  const deploymentInfo = {
    address: address,
    minDepositToVote: minDeposit.toString(),
    network: "sepolia",
    deployedAt: new Date().toISOString()
  };

  const outputPath = path.join(__dirname, "../deployed-address.json");
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("📝 Deployment info saved to:", outputPath);

  // Wait for block confirmations
  console.log("⏳ Waiting for block confirmations...");
  await dao.deploymentTransaction().wait(5);
  console.log("✅ Contract confirmed!");

  console.log("\n📋 Contract verification command:");
  console.log(`npx hardhat verify --network sepolia ${address} "${minDeposit}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
