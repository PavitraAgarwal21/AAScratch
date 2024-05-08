
const hre = require("hardhat");

async function main() {
 
    const EP = await hre.ethers.deployContract("EntryPoint");

    await EP.waitForDeployment();
  
    console.log(
      ` Entrypoint deployed to ${EP.target}`
    );

  const AF = await hre.ethers.deployContract("AccountFactory");

  await AF.waitForDeployment();

  console.log(
    ` Account Factory deployed to ${AF.target}`
  );
  const PA = await hre.ethers.deployContract("Paymaster");

  await PA.waitForDeployment();

  console.log(
    ` Paymaster deployed to ${PA.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
