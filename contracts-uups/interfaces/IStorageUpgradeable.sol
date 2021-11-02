// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity ^0.8.8;

interface IStorageUpgradeable {
	event FeeToTransfered(address indexed oldFeeTo, address indexed newFeeTo);

	function version() external pure returns (string memory);

	function ETH() external view returns (address);

	function WETH() external view returns (address);

	function feeTo() external view returns (address);

	function setFeeTo(address newFeeTo) external;
}