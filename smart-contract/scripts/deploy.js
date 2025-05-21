const hre = require("hardhat");

async function main() {
  console.log("Running deploy script...");

  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");

  const contract = await BuyMeACoffee.deploy(); // <-- THIS must be awaited
  await contract.deploymentTransaction().wait(); // <-- For new Hardhat versions

  console.log("BuyMeACoffee deployed to:", contract.target); // Use .target instead of .address in latest Ethers
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
