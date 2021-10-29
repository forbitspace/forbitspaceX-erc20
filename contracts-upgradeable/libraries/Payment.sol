// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity ^0.8.8;

import { IPayment } from "../interfaces/IPayment.sol";
import { IWETH, IERC20 } from "../interfaces/IWETH.sol";
import { SafeERC20, Address } from "./SafeERC20.sol";
import { SafeMath } from "./SafeMath.sol";
import { Storage } from "./Storage.sol";

abstract contract Payment is IPayment, Storage {
	using SafeMath for uint;
	using SafeERC20 for IERC20;

	function approve(
		address addressToApprove,
		address token,
		uint amount
	) internal {
		if (IERC20(token).allowance(address(this), addressToApprove) < amount) {
			IERC20(token).safeApprove(addressToApprove, 0);
			IERC20(token).safeIncreaseAllowance(addressToApprove, type(uint).max);
		}
	}

	function initialize() public initializer {}

	function balanceOf(address token) internal view returns (uint bal) {
		if (token == ETH()) {
			token = WETH();
		}

		bal = IERC20(token).balanceOf(address(this));
	}

	function pay(
		address recipient,
		address token,
		uint amount
	) internal {
		if (amount > 0) {
			if (recipient == address(this)) {
				if (token == ETH()) {
					IWETH(WETH()).deposit{ value: amount }();
				} else {
					IERC20(token).safeTransferFrom(_msgSender(), address(this), amount);
				}
			} else {
				if (token == ETH()) {
					if (balanceOf(WETH()) > 0) IWETH(WETH()).withdraw(balanceOf(WETH()));
					Address.sendValue(payable(recipient), amount);
				} else {
					IERC20(token).safeTransfer(recipient, amount);
				}
			}
		}
	}

	function collectETH() public override returns (uint amount) {
		if (balanceOf(WETH()) > 0) {
			IWETH(WETH()).withdraw(balanceOf(WETH()));
		}

		if ((amount = address(this).balance) > 0) {
			Address.sendValue(payable(feeTo()), amount);
		}
	}

	function collectTokens(address token) public override returns (uint amount) {
		if (token == ETH()) {
			amount = collectETH();
		} else if ((amount = balanceOf(token)) > 0) {
			IERC20(token).safeTransfer(feeTo(), amount);
		}

		if (amount > 0) {
			emit FeeCollected(token, amount);
		}
	}
}
