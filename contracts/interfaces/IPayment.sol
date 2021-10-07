// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.8.0;

interface IPayment {
	function collectETH() external returns (uint amount);

	function collectTokens(address token) external returns (uint amount);
}
