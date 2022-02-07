pragma solidity ^0.8.0;
import "./evmspace.sol";
import "./interfaces/ICrossSpaceCall.sol";

contract TestCrossCallEvm {
    address public tInEvmside;

    ICrossSpaceCall constant crossSpaceCall =
        ICrossSpaceCall(0x0888000000000000000000000000000000000006);

    constructor(address _tInEvmside) {
        tInEvmside = _tInEvmside;
    }

    function StaticCall() public view {
        bytes memory data = abi.encodeWithSelector(
            TestEVMSpace.StaticCall.selector
        );
        crossSpaceCall.staticCallEVM(bytes20(tInEvmside), data);
    }

    function Call() public {
        bytes memory data = abi.encodeWithSelector(TestEVMSpace.Call.selector);
        crossSpaceCall.callEVM(bytes20(tInEvmside), data);
    }

    function DelegateCall() public {
        bytes memory data = abi.encodeWithSelector(TestEVMSpace.DelegateCall.selector);
        crossSpaceCall.callEVM(bytes20(tInEvmside), data);
    }

    function Create() public {
        bytes memory data = abi.encodeWithSelector(TestEVMSpace.Create.selector);
        crossSpaceCall.callEVM(bytes20(tInEvmside), data);
    }

    function CreateAndKill() public {
        bytes memory data = abi.encodeWithSelector(TestEVMSpace.CreateAndKill.selector);
        crossSpaceCall.callEVM(bytes20(tInEvmside), data);
    }

    function StaticCallAndRevert() public view{
        bytes memory data = abi.encodeWithSelector(TestEVMSpace.StaticCallAndRevert.selector);
        crossSpaceCall.staticCallEVM(bytes20(tInEvmside), data);
    }

    function CallAndRevert() public{
        bytes memory data = abi.encodeWithSelector(TestEVMSpace.CallAndRevert.selector);
        crossSpaceCall.callEVM(bytes20(tInEvmside), data);
    }

    function CreateAndRevert() public{
        bytes memory data = abi.encodeWithSelector(TestEVMSpace.CreateAndRevert.selector);
        crossSpaceCall.callEVM(bytes20(tInEvmside), data);
    }

    function StaticCallAndCatch() public view{
        bytes memory data = abi.encodeWithSelector(TestEVMSpace.StaticCallAndCatch.selector);
        crossSpaceCall.staticCallEVM(bytes20(tInEvmside), data);
    }

    function CallAndCatch() public{
        bytes memory data = abi.encodeWithSelector(TestEVMSpace.CallAndCatch.selector);
        crossSpaceCall.callEVM(bytes20(tInEvmside), data);
    }

    function CreateAndCatch() public{
        bytes memory data = abi.encodeWithSelector(TestEVMSpace.CreateAndCatch.selector);
        crossSpaceCall.callEVM(bytes20(tInEvmside), data);
    }

    function Integration1() public{
        bytes memory data = abi.encodeWithSelector(TestEVMSpace.Integration1.selector);
        crossSpaceCall.callEVM(bytes20(tInEvmside), data);
    }

    function Integration2() public{
        bytes memory data = abi.encodeWithSelector(TestEVMSpace.Integration2.selector);
        crossSpaceCall.callEVM(bytes20(tInEvmside), data);
    }


}
