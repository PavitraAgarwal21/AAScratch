
const hre = require("hardhat");

const ACCOUNT_ADD = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c"; 
async function main() {
 
  const account = await hre.ethers.getContractAt("Account",ACCOUNT_ADD);
const count = await account.count();
  console.log(count);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
