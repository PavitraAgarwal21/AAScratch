
const hre = require("hardhat");

async function main() {
 
  const Ep = await hre.ethers.deployContract("AccountFactory");

  await Ep.waitForDeployment();

  console.log(
    ` deployed to ${Ep.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
