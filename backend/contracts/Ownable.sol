pragma solidity 0.5.12;

contract Ownable {  //This parent contract can inherit from someone else.. you can inherit from multiple contracts
    
    //If its set to public anyone will be able to access it
    //If its set to private instead of public then owner state variable will only be able to be accessed within this contract, not from children
    //If its internal then its same as private except children can access it aswell
    //External makes it available only to external contracts
    address internal owner;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller needs to be owner");
        _;  //continue execution
    }

    constructor() public {
        owner = msg.sender;
    }
}