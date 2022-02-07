pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract TestEVMSpace {
    uint256 cache;
    MustOkContract public mustOkContract;
    MustOkContract public mustOkContract2;

    constructor() {
        Create();
    }

    function StaticCall() public view {
        mustOkContract.Foo();
    }

    function Call() public {
        mustOkContract.SetStorage(1);
        bytes memory payload = abi.encodeWithSignature("SetStorage(uint256)", 100);
        (bool success, bytes memory returnData) = address(mustOkContract).call(payload);
        require(success);
    }

    function DelegateCall() public {
        cache=0;
        bytes memory payload = abi.encodeWithSignature("SetStorage(uint256)", 100);
        (bool success, bytes memory returnData) = address(mustOkContract).delegatecall(payload);
        require(success);
        require(cache == 100);
    }

    function Create() public {
        mustOkContract = new MustOkContract();
    }

    function Creat2() public {}

    function CreateAndKill() public {
        MustOkContract m = new MustOkContract();
        m.Suicide();
    }

    function StaticCallAndRevert() public view {
        mustOkContract.FooRevert();
    }

    function CallAndRevert() public {
        mustOkContract.SetStorage(1);
        revert();
    }

    function CreateAndRevert() public {
        new MustFailedContract();
    }

    function StaticCallAndCatch() public view {
        try mustOkContract.FooRevert() {
            console.log("Expect revert but not");
        } catch {
            console.log("Caught exception");
        }
    }

    function CallAndCatch() public {
        try mustOkContract.SetStorage(1) {
            console.log("Expect revert but not");
        } catch {
            console.log("Caught exception");
        }
    }

    function CreateAndCatch() public {
        try new MustFailedContract() {
            console.log("Expect revert but not");
        } catch {
            console.log("Caught exception");
        }
    }

    function Integration1() public {
        Call();
        DelegateCall();

        StaticCallAndCatch();
        CallAndCatch();
        CreateAndCatch();

        Create();
        CreateAndKill();
    }

    function Integration2() public {
        CreateAndKill();
        
        CallAndCatch();
        CreateAndCatch();
        
        Create();
        Call();
        StaticCallAndCatch();
        DelegateCall();
    }
}

contract MustFailedContract {
    constructor() {
        revert();
    }
}

contract MustOkContract {
    uint256 cache;

    function Foo() public pure {}

    function FooRevert() public pure {
        revert();
    }

    function SetStorage(uint256 n) public {
        cache = n;
        require(cache == n);
    }

    function Suicide() public {
        selfdestruct(payable(msg.sender));
    }
}
