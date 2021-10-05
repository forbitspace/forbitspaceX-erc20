import { web3 } from "hardhat";
import { AbiItem } from "web3-utils";

import {
  abi as FORBITSPACEX_ABI,
  address as FORBITSPACEX_ADDRESS,
} from "../abis/forbitspaceX01.json";
import { abi as ERC20_ABI } from "../abis/IERC20.json";
import { abi as ROUTER_V2_ABI } from "../abis/IUniswapV2Router02.json";
import { abi as ROUTER_V3_ABI } from "../abis/ISwapRouter.json";

import {
  ZERO_ADDRESS,
  WETH_ADDRESS,
  UNI_ADDRESS,
  SUSHI_ROUTER_ADDRESS,
  UNIV2_ROUTER_ADDRESS,
  UNIV3_ROUTER_ADDRESS,
} from "./constants/addresses";

import { MAX_UINT256 } from "./constants/hex";

import { SwapParam } from "./types/SwapParam";

async function main() {
  const [account] = await web3.eth.getAccounts();

  const WETH = new web3.eth.Contract(ERC20_ABI as AbiItem[], WETH_ADDRESS);
  const forbitspaceX = new web3.eth.Contract(
    FORBITSPACEX_ABI as AbiItem[],
    FORBITSPACEX_ADDRESS
  );
  const sushiRouter = new web3.eth.Contract(
    ROUTER_V2_ABI as AbiItem[],
    SUSHI_ROUTER_ADDRESS
  );
  const uniV2Router = new web3.eth.Contract(
    ROUTER_V2_ABI as AbiItem[],
    UNIV2_ROUTER_ADDRESS
  );
  const uniV3Router = new web3.eth.Contract(
    ROUTER_V3_ABI as AbiItem[],
    UNIV3_ROUTER_ADDRESS
  );

  // shoud use oracle price
  const amountTotal: string = web3.utils.toHex(
    web3.utils.toWei("0.15", "ether")
  );
  const amountIn: string = web3.utils.toHex(
    web3.utils.toWei("0.049975", "ether")
  );
  const amountOut: string = web3.utils.toHex(web3.utils.toWei("0.0", "ether"));
  const deadline: string = web3.utils.toHex(
    Math.round(Date.now() / 1000) + 60 * 20
  );

  const approve = WETH.methods.approve(FORBITSPACEX_ADDRESS, MAX_UINT256);
  const swapExactTokensForTokens = uniV2Router.methods.swapExactTokensForTokens(
    amountIn,
    amountOut,
    [WETH_ADDRESS, UNI_ADDRESS],
    FORBITSPACEX_ADDRESS,
    deadline
  );
  const exactInputSingleParams = {
    tokenIn: WETH_ADDRESS,
    tokenOut: UNI_ADDRESS,
    fee: "3000",
    recipient: FORBITSPACEX_ADDRESS,
    deadline: deadline,
    amountIn: amountIn,
    amountOutMinimum: amountOut,
    sqrtPriceLimitX96: "0x00",
  };

  const exactInputSingle = uniV3Router.methods.exactInputSingle(
    exactInputSingleParams
  );

  const approveUniV2 = WETH.methods.approve(UNIV2_ROUTER_ADDRESS, MAX_UINT256);
  const approveUniV3 = WETH.methods.approve(UNIV3_ROUTER_ADDRESS, MAX_UINT256);
  const approveSushi = WETH.methods.approve(SUSHI_ROUTER_ADDRESS, MAX_UINT256);

  var swapParam: SwapParam[] = [
    {
      target: WETH_ADDRESS,
      swapData: approveSushi.encodeABI(),
    },
    {
      target: WETH_ADDRESS,
      swapData: approveUniV2.encodeABI(),
    },
    {
      target: WETH_ADDRESS,
      swapData: approveUniV3.encodeABI(),
    },
    {
      target: SUSHI_ROUTER_ADDRESS,
      swapData: swapExactTokensForTokens.encodeABI(),
    },
    {
      target: UNIV2_ROUTER_ADDRESS,
      swapData: swapExactTokensForTokens.encodeABI(),
    },
    {
      target: UNIV3_ROUTER_ADDRESS,
      swapData: exactInputSingle.encodeABI(),
    },
  ];

  const aggregate = forbitspaceX.methods.aggregate(
    WETH_ADDRESS,
    UNI_ADDRESS,
    amountTotal,
    swapParam
  );

  const aggregateETH = forbitspaceX.methods.aggregate(
    ZERO_ADDRESS,
    UNI_ADDRESS,
    amountTotal,
    swapParam
  );

  var allowance = await WETH.methods
    .allowance(account, FORBITSPACEX_ADDRESS)
    .call();
  if (web3.utils.toHex(allowance) < amountTotal) {
    console.log("forbitspaceX approving...");
    await approve.send({ from: account });
    allowance = await WETH.methods
      .allowance(account, FORBITSPACEX_ADDRESS)
      .call();
  }
  console.log("Approved >>>", allowance);

  console.log("Calling...");

  const [estimateGas, estimateGasETH, results, resultsETH] = await Promise.all([
    aggregate.estimateGas({ from: account }),
    aggregateETH.estimateGas({
      from: account,
      value: amountTotal,
    }),
    aggregate.call({ from: account }),
    aggregateETH.call({
      from: account,
      value: amountTotal,
    }),
  ]);

  console.log("estimateGas >>>", estimateGas);
  console.log("results >>>", results);
  console.log("estimateGasETH >>>", estimateGasETH);
  console.log("resultsETH >>>", resultsETH);

  // const tx = await aggregate.send({ from: account });
  // console.log("tx >>>", tx);

  // const txETH = await aggregate.send({
  //   from: account,
  //   value: amountTotal,
  // });
  // console.log("txETH >>>", txETH);

  const [collectETH, collectTokens] = await Promise.all([
    forbitspaceX.methods.collectETH().call({ from: account }),
    forbitspaceX.methods.collectTokens(WETH_ADDRESS).call({ from: account }),
  ]);

  console.log("collectETH >>>", collectETH);
  console.log("collectWETH >>>", collectTokens);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
