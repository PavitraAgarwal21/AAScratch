
const hre = require("hardhat");
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const Paymaster = "0xf1C01982c73022FA9ee5c9aB0379FDa17F4309c2";
async function main() {
const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS) ;
await entryPoint.depositTo(Paymaster , {
    value : hre.ethers.parseEther(".2"),
}); 
console.log("deposit is sucessfull") ;
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
