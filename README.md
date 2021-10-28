# forbitspaceX smart contract

forbitspaceX is a DeFi aggregator, offering access to the deepest liquidity and the best token swap rates on various DEXes, including partial fill and the ability to find the best swap paths across multiple liquidity sources.

## Installation

Use the package manager [npm](https://nodejs.org/en/download/).

```bash
npm install
```

Use the package manager [yarn](https://yarnpkg.com/getting-started/install).

```bash
yarn install
```

## Configuration

Copy .env file.

```bash
cp -R .env.example .env
```

Fill in .env file.

```bash
API_KEY =
INFURA_KEY = 
PRIVATE_KEY =
PRIVATE_KEY_MAINNET =
PRIVATE_KEY_POLYGON =
PRIVATE_KEY_BSC =
PRIVATE_KEY_AVALANCHE =
```

## Usage

Deploy forbitspaceX smart contract on rinkeby testnet.

```bash
npm run deploy
```

Verify forbitspaceX smart contract on rinkeby testnet.

```bash
npm run verify
```

## Deployment addresses

- [Ethereum](https://etherscan.io/address/0xb3FeF4B71A4EDB6f1BD51bf9417876042B936dd6#code): `0xb3FeF4B71A4EDB6f1BD51bf9417876042B936dd6`

- [Binance Smart Chain](https://bscscan.com/address/0xb3FeF4B71A4EDB6f1BD51bf9417876042B936dd6#code): `0xb3FeF4B71A4EDB6f1BD51bf9417876042B936dd6`

- [Polygon](https://polygonscan.com/address/0xb3FeF4B71A4EDB6f1BD51bf9417876042B936dd6#code): `0xb3FeF4B71A4EDB6f1BD51bf9417876042B936dd6`

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[GPL-2.0-or-later](https://spdx.org/licenses/GPL-2.0-or-later.html)
