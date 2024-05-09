
const hre = require("hardhat");

const ACCOUNT_ADD = "0xeb4374ddc1e1874d7b26798aeedf148ab5ab5e5c"; 
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const Paymaster = "0xf1C01982c73022FA9ee5c9aB0379FDa17F4309c2";



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
