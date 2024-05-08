// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol"; 
import "hardhat/console.sol";


contract Account is IAccount {
    uint256 public  count = 0 ;
    address public  owner ;
    constructor (address _owner) {
        owner = _owner ;
    }
    function validateUserOp(UserOperation calldata userOp , bytes32 , uint256 )
    external  view returns (uint256 validationData) {
        // return  0; //initialiy we only set that all the one userops is valid 
        // changing this to only the valid signatute from the the onwer is able to validateUserop 
        address recovered = ECDSA.recover(ECDSA.toEthSignedMessageHash(keccak256("wee")), userOp.signature); // hash we have to generate the from the message 
        return recovered == owner ? 0 : 1 ;
    }
    function execute() external  {
        count += 1 ;
    }
}
contract AccountFactory {
    function createAccount(address owner ) external returns (address) {
        Account acc = new Account(owner) ;
        return address(acc) ;
    }
}