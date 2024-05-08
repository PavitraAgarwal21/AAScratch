
const hre = require("hardhat");

async function main() {

    const [signer0 ] = await hre.ethers.getSigners() ;

    const sig = signer0.signMessage(hre.ethers.getBytes(hre.ethers.id("wee")));
    const Test = await hre.ethers.getContractFactory("Test");
    const test = await Test.deploy(sig);

    console.log("signer address " , await signer0.getAddress() );

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
