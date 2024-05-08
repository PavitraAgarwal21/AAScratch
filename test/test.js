
const hre = require("hardhat");

const ACCOUNT_ADD = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c"; 
const EP_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const Paymaster = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";



async function main() {
 
  const account = await hre.ethers.getContractAt("Account",ACCOUNT_ADD);
const count = await account.count();
  console.log(count);

console.log(" smart account balance " , await hre.ethers.provider.getBalance(ACCOUNT_ADD)) ;
const ep = await hre.ethers.getContractAt("EntryPoint",EP_ADDRESS); 
console.log("entry point balance " , await ep.balanceOf(ACCOUNT_ADD) ); 
console.log("paymaster balance " , await ep.balanceOf(Paymaster) ); 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
