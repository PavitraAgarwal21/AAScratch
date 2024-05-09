// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol"; 
import "@openzeppelin/contracts/utils/Create2.sol";
import "hardhat/console.sol";


contract Account is IAccount {
    uint256 public  count = 0 ;
    address public  owner ;
    constructor (address _owner) {
        owner = _owner ;
    }
    function validateUserOp(UserOperation calldata userOp , bytes32 userOpHash, uint256 )
    external  view returns (uint256 validationData) {
        // return  0; //initialiy we only set that all the one userops is valid 
        // changing this to only the valid signatute from the the onwer is able to validateUserop 
        address recovered = ECDSA.recover(ECDSA.toEthSignedMessageHash(userOpHash), userOp.signature); // hash we have to generate the from the message 
        return recovered == owner ? 0 : 1 ;
    }
    function execute() external  {
        count += 1 ;
    }
}
contract AccountFactory {


    function deploy(
        bytes32 salt,
        bytes memory bytecode
    ) internal returns (address) {
        address addr;
        require(bytecode.length != 0, "Create2: bytecode length is zero");
        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }
        require(addr != address(0), "Create2: Failed on deploy");
        return addr;
    }

    function createAccount(address owner ) external returns (address) {
        bytes32 salt =  bytes32(uint256(uint160(owner)));
        bytes memory bytecode =  abi.encodePacked(type(Account).creationCode, abi.encode(owner));
     
           // we have to chaeck that it first deployed or not  
      address addr = Create2.computeAddress(salt, keccak256(bytecode)); 
    if (addr.code.length > 0) {
        return addr ;
    }
      return deploy(salt, bytecode);
     
    }
}