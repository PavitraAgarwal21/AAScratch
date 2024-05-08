
const hre = require("hardhat");

const Factory_Nonce = 1 ; 
const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" ;
const EP_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const Paymaster = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
async function main() {
    const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS) ;
//    sender is the address of the smart account but we have to know this address even before it is been deployed so 
// we have to determine the address of the smart account 
// as we are using the Create == (deployer , nonce) // hence the deployer here is the account factory 

const sender = hre.ethers.getCreateAddress( {
    from : FACTORY_ADDRESS ,
    nonce: Factory_Nonce 
}) ;

// creating the init code 
// init code  = first 20 bytes is the address of the account factory + encoded fucniton ddata which we want to call at the start 
// here we want to deploy the contract so the fucntion is the createAccount which is encoded in the init code  
//first we get the fafctory account 
const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
const [signer0 , signer1 ] = await hre.ethers.getSigners() ;
const address0 = await signer0.getAddress() ;
const initCode = "0x" ;
// FACTORY_ADDRESS +  AccountFactory.interface.encodeFunctionData("createAccount" , [address0]).slice(2) // with argument owner of the smart account 
const Account = await hre.ethers.getContractFactory("Account");
// call data what is happen to the smart account onwards 
// await entryPoint.depositTo(Paymaster , {
//     value : hre.ethers.parseEther("100"),
// }); // on behalf of paymater 
console.log(`sender address is ${sender}`);
const userOp = {
     sender,
     nonce : await entryPoint.getNonce(sender,0) , // nonce fro the particular user operation 
     initCode,
     callData : Account.interface.encodeFunctionData("execute"),
     callGasLimit:500_000,
     verificationGasLimit:500_000,
     preVerificationGas: 100_000,
     maxFeePerGas : hre.ethers.parseUnits("10", "gwei") ,
     maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei") ,
     paymasterAndData : Paymaster ,
     signature : signer0.signMessage(hre.ethers.getBytes(hre.ethers.id("wee"))) ,
}

const tx = await entryPoint.handleOps([userOp] , address0) ;
const receipt = await tx.wait();
console.log(receipt) ;

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
