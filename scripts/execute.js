
const hre = require("hardhat");


const FACTORY_ADDRESS = "0x1ed6676dB4041236Eaa9C5E46540B15E52D40c4E" ;
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const Paymaster = "0xf1C01982c73022FA9ee5c9aB0379FDa17F4309c2";
async function main() {
    const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS) ;
//    sender is the address of the smart account but we have to know this address even before it is been deployed so 
// we have to determine the address of the smart account 
// as we are using the Create == (deployer , nonce) // hence the deployer here is the account factory 


// creating the init code 
// init code  = first 20 bytes is the address of the account factory + encoded fucniton ddata which we want to call at the start 
// here we want to deploy the contract so the fucntion is the createAccount which is encoded in the init code  
//first we get the fafctory account 
const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
const [signer0 , signer1 ] = await hre.ethers.getSigners() ;
const address0 = await signer0.getAddress() ;
let initCode = FACTORY_ADDRESS +  AccountFactory.interface.encodeFunctionData("createAccount" , [address0]).slice(2);

// getting the sender {smart account address} and read it from the error message ; 
let sender  = "0x" ;
try {
  await entryPoint.getSenderAddress(initCode)
} 
catch (ex){
  sender = "0x"+ex.data.slice(-40);
}

const code = await hre.ethers.provider.getCode(sender); 
if (code !== "0x") {
  initCode = "0x" ;
}
const Account = await hre.ethers.getContractFactory("Account");
console.log(`sender address is ${sender}`);

const userOp = {
     sender,
     nonce : "0x" +  (await entryPoint.getNonce(sender,0)).toString(16) , // nonce fro the particular user operation 
     initCode,
     callData : Account.interface.encodeFunctionData("execute"),
    //  callGasLimit:500_000,
    //  verificationGasLimit:500_000, // to make these real values from the api 
    //  preVerificationGas: 100_000,
    //  maxFeePerGas : hre.ethers.parseUnits("10", "gwei") ,
    //  maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei") ,
     paymasterAndData : Paymaster ,
     signature : "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c" ,
}
const {preVerificationGas , callGasLimit , verificationGasLimit } = await hre.ethers.provider.send("eth_estimateUserOperationGas" , [userOp , EP_ADDRESS] );
userOp.preVerificationGas = preVerificationGas ;
userOp.callGasLimit = callGasLimit ;
userOp.verificationGasLimit = verificationGasLimit ;

const {maxFeePerGas} = await hre.ethers.provider.getFeeData() ;
userOp.maxFeePerGas = "0x" + maxFeePerGas.toString(16);
userOp.maxPriorityFeePerGas = await  hre.ethers.provider.send("rundler_maxPriorityFeePerGas") ;
// console.log(userOp) ;

//signing the userops data ; 
const userOpHash = await entryPoint.getUserOpHash(userOp) ;
sig = await signer0.signMessage(hre.ethers.getBytes(userOpHash));
userOp.signature = sig ;


const opHash = await hre.ethers.provider.send("eth_sendUserOperation" , [
  userOp ,
  EP_ADDRESS ,
])

setTimeout(async ()=> {
  const {transactionHash} = await hre.ethers.provider.send("eth_getUserOperationByHash" , [
    opHash 
  ]);
  console.log(transactionHash) ;
} , 5000 ) ;


// instead of sending this to the 
// const tx = await entryPoint.handleOps([userOp] , address0) ;
// const receipt = await tx.wait();
// console.log(receipt) ;

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
