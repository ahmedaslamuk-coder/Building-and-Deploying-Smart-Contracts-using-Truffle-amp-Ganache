# PressVote | MG3012 Assignment 3
Each wallet can vote once for Night Market or Fresh Type. The Assignment 2 Solidity contract records each vote. The frontend uses ethers.js and MetaMask to send transactions and read totals.

## Setup
Install Node.js and npm. From the project root install the dependencies with npm.cmd install. For initial project creation the tools were installed with npm.cmd install --save-dev truffle@5.11.5 ganache@7.9.2 http-server@14.1.1 and the project scaffolded with npx.cmd truffle init.

## Run
1. Start the local blockchain and leave this terminal open:
   `npx.cmd ganache --server.host 127.0.0.1 --server.port 8545 --chain.chainId 1337 --chain.networkId 1337`
2. In a second terminal compile with `npx.cmd truffle compile --all`, then deploy with `npx.cmd truffle migrate --network development`. Copy the PressVote contract address.
3. Serve the page with `npx.cmd http-server frontend -a 127.0.0.1 -p 8080 -c-1`. Open http://127.0.0.1:8080 in a browser with MetaMask and internet access for the ethers.js CDN.
4. Add Ganache Local to MetaMask (RPC http://127.0.0.1:8545, chain ID 1337, symbol ETH). Import one funded Ganache test account and select it.

## Test the ballot
Paste the deployed contract address and connect. On a fresh deployment both counts start at zero. Select Night Market and confirm the vote in MetaMask. Check the receipt and updated count. Reload, reconnect the same wallet and verify repeat voting is disabled. A second funded account can vote for Fresh Type.

## Observed result
Ganache confirmed the Night Market vote in block 4. The ballot showed Night Market 1 and Fresh Type 0. The compilation screenshot also shows an early migration error. The next screenshot records the successful deployment after the migration script was corrected.

## Screenshots
- [Compilation](screenshots/01-compile.png)
- [Deployment](screenshots/02-migrate.png)
- [Confirmed vote](screenshots/03-vote.png)
