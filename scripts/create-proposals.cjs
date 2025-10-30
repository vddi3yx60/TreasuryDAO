const hre = require("hardhat");

async function main() {
  const CONTRACT_ADDRESS = "0x73FbaE0f1e2000F607E52Fd3087AeD88341847fB";

  console.log("🚀 Creating test proposals on SimpleTreasuryDAO...");
  console.log("Contract:", CONTRACT_ADDRESS);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);

  const dao = await hre.ethers.getContractAt("SimpleTreasuryDAO", CONTRACT_ADDRESS);

  // First, deposit enough ETH to create proposals (need 0.001 ETH minimum)
  console.log("\n💰 Depositing ETH to gain voting rights...");
  const depositTx = await dao.deposit({ value: hre.ethers.parseEther("0.01") });
  await depositTx.wait();
  console.log("✅ Deposited 0.01 ETH");

  // Use deployer address as recipient for all proposals
  const recipient = deployer.address;

  // Proposal 1: Infrastructure Upgrade
  console.log("\n📝 Creating Proposal 1: Infrastructure Upgrade");
  const tx1 = await dao.createProposal(
    "Upgrade DAO Infrastructure",
    "Allocate 1 ETH to upgrade our infrastructure including new servers, improved security measures, and enhanced monitoring tools.",
    hre.ethers.parseEther("1"),
    recipient,
    7 // 7 days voting period
  );
  await tx1.wait();
  console.log("✅ Proposal 1 created");

  // Proposal 2: Community Grant Program
  console.log("\n📝 Creating Proposal 2: Community Grant Program");
  const tx2 = await dao.createProposal(
    "Launch Community Grant Program",
    "Establish a community grant program with 0.5 ETH to fund innovative projects built by community members.",
    hre.ethers.parseEther("0.5"),
    recipient,
    5 // 5 days voting period
  );
  await tx2.wait();
  console.log("✅ Proposal 2 created");

  // Proposal 3: Marketing Campaign
  console.log("\n📝 Creating Proposal 3: Marketing Campaign");
  const tx3 = await dao.createProposal(
    "Q1 Marketing Campaign",
    "Fund a comprehensive marketing campaign including social media ads, influencer partnerships, and content creation for 0.3 ETH.",
    hre.ethers.parseEther("0.3"),
    recipient,
    3 // 3 days voting period
  );
  await tx3.wait();
  console.log("✅ Proposal 3 created");

  // Proposal 4: Security Audit
  console.log("\n📝 Creating Proposal 4: Security Audit");
  const tx4 = await dao.createProposal(
    "Smart Contract Security Audit",
    "Hire a professional security firm to audit our smart contracts and provide recommendations. Budget: 2 ETH.",
    hre.ethers.parseEther("2"),
    recipient,
    10 // 10 days voting period
  );
  await tx4.wait();
  console.log("✅ Proposal 4 created");

  // Check total proposals
  const count = await dao.getProposalCount();
  console.log("\n✅ Total proposals created:", count.toString());

  // Display proposal details
  console.log("\n📋 Proposal Summary:");
  for (let i = 0; i < Number(count); i++) {
    const proposal = await dao.getProposal(i);
    console.log(`\nProposal ${i}:`);
    console.log(`  Title: ${proposal[1]}`);
    console.log(`  Amount: ${hre.ethers.formatEther(proposal[4])} ETH`);
    console.log(`  Deadline: ${new Date(Number(proposal[6]) * 1000).toLocaleString()}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
