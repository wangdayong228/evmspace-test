// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICrossSpaceCall {
    event Call(
        bytes20 indexed sender,
        bytes20 indexed receiver,
        uint256 value,
        uint256 nonce,
        bytes data
    );

    event Create(
        bytes20 indexed sender,
        bytes20 indexed contract_address,
        uint256 value,
        uint256 nonce,
        bytes init
    );

    event Withdraw(
        bytes20 indexed sender,
        address indexed receiver,
        uint256 value
    );

    function createEVM(bytes calldata init) external payable returns (bytes20);

    function transferEVM(bytes20 to)
        external
        payable
        returns (bytes memory output);

    function callEVM(bytes20 to, bytes calldata data)
        external
        payable
        returns (bytes memory output);

    function staticCallEVM(bytes20 to, bytes calldata data)
        external
        view
        returns (bytes memory output);

    function withdrawFromMapped(uint256 value) external;

    function mappedBalance(address addr) external view returns (uint256);

    function mappedNonce(address addr) external view returns (uint256);
}
