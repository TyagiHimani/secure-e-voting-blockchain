# Blockchain Secure E-Voting System

A **master's level academic prototype** demonstrating a blockchain-based secure e-voting system. Votes are stored on-chain (Hardhat local blockchain), with one-voter-one-vote enforced by a Solidity smart contract.

---

## Project overview

This system shows:

- **Secure voting**: Votes are recorded as transactions on a blockchain.
- **One voter, one vote**: The smart contract prevents duplicate votes per wallet address.
- **Immutable storage**: Once a vote is cast, it cannot be altered or deleted.
- **Automatic counting**: Vote totals are maintained and read directly from the contract.

---

## System architecture

```
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
│   Browser   │────▶│  Express    │────▶│  In-memory DB    │
│ (HTML/JS)   │     │  Backend    │     │  (voter list)    │
└──────┬──────┘     └─────────────┘     └──────────────────┘
       │
       │ MetaMask + ethers.js
       ▼
┌──────────────────┐
│  Hardhat local   │
│  (Ethereum node) │
│  Voting.sol      │
└──────────────────┘
```

- **Frontend**: Static HTML/CSS/JS; connects to MetaMask and talks to the contract via ethers.js.
- **Backend**: Express server for voter registration and login; serves the frontend.
- **Blockchain**: Hardhat local network; `Voting.sol` holds candidates and votes.

---

## Technologies used

| Layer        | Technology                          |
|-------------|--------------------------------------|
| Frontend    | HTML, CSS, Vanilla JavaScript        |
| Backend     | Node.js, Express.js                  |
| Blockchain  | Solidity 0.8.19, Hardhat             |
| Wallet      | MetaMask, ethers.js v6               |
| Storage     | In-memory (voters), on-chain (votes) |

---

## How blockchain ensures security

1. **Immutability**: Vote transactions are stored on the blockchain and cannot be changed.
2. **Duplicate prevention**: The contract keeps a `mapping(address => bool) hasVoted` and reverts if someone votes twice.
3. **Transparency**: Anyone can read `getCandidates()` and `getWinner()` to verify counts.
4. **No central tally server**: Vote logic and storage live in the contract; the backend only handles registration and login.

---

## Project folder structure

```
evoting-blockchain/
├── contracts/
│   └── Voting.sol          # Smart contract (candidates, vote, getCandidates, getWinner)
├── scripts/
│   └── deploy.js           # Deploys Voting.sol and updates frontend config
├── backend/
│   ├── server.js           # Express app, serves API + frontend
│   ├── routes.js           # /api/register, /api/login, /api/config
│   └── database.js         # In-memory voter storage
├── frontend/
│   ├── index.html          # Landing page
│   ├── login.html          # Register / login
│   ├── vote.html           # List candidates, cast vote, admin add candidate
│   ├── results.html        # Vote counts and winner
│   ├── app.js              # Wallet + contract helpers (ethers.js)
│   ├── config.js           # CONTRACT_ADDRESS (set by deploy script)
│   ├── contract-abi.js     # ABI for frontend
│   └── styles.css          # Styles
├── hardhat.config.js
├── package.json
├── .gitignore
└── README.md
```

---

## Setup instructions

### Prerequisites

- **Node.js** (v18 or v20 recommended)
- **MetaMask** browser extension
- Terminal (or two: one for Hardhat, one for backend)

### Step 1: Install Node.js

Install from [nodejs.org](https://nodejs.org) if needed. Check:

```bash
node -v
npm -v
```

### Step 2: Install dependencies

From the project root:

```bash
cd evoting-blockchain
npm install
```

### Step 3: Start Hardhat local blockchain

In a **first terminal**:

```bash
npm run node
```

Leave this running. You should see accounts and "Listening on 127.0.0.1:8545".

### Step 4: Deploy the contract

In a **second terminal** (same folder):

```bash
npm run deploy
```

Note the printed contract address. The deploy script also writes it to `frontend/config.js`.

### Step 5: Run the backend

In the same second terminal (or a third one):

```bash
npm run server
```

You should see: `E-Voting server running at http://localhost:3000`.

### Step 6: Open the frontend

1. Open **http://localhost:3000** in your browser.
2. Install **MetaMask** if you haven’t.
3. In MetaMask, add the Hardhat network:
   - Network name: e.g. **Hardhat Local**
   - RPC URL: **http://127.0.0.1:8545**
   - Chain ID: **31337**
4. Import a Hardhat account (use a private key from the `npx hardhat node` output; e.g. account #0 is the deployer/admin).

Then:

- **Register**: Go to Register/Login, connect MetaMask, enter name and email, submit.
- **Login**: Same page, connect the same wallet, click Login.
- **Vote**: Open Vote, connect MetaMask. If you’re the deployer, add candidates in the admin section, then vote.
- **Results**: Open Results to see counts and winner from the contract.

---

## Example commands (quick reference)

```bash
# Terminal 1 – blockchain
npm run node

# Terminal 2 – deploy then server
npm run deploy
npm run server
```

Then open **http://localhost:3000**.

---

## Smart contract logic

- **Candidate**: `id`, `name`, `voteCount`.
- **hasVoted**: mapping from voter address to boolean.
- **addCandidate(name)**: Only `owner` (deployer); appends a new candidate.
- **vote(candidateId)**: Requires `!hasVoted[msg.sender]` and valid `candidateId`; sets `hasVoted[msg.sender] = true` and increments the candidate’s `voteCount`.
- **getCandidates()**: Returns arrays of ids, names, and vote counts.
- **getWinner()**: Returns the candidate id and vote count with the highest votes (tie: lowest id with max votes).

---

## Vote flow

1. User registers (name, email, wallet) via backend.
2. User logs in with the same wallet (backend checks registration).
3. User opens Vote page and connects MetaMask.
4. Contract owner adds candidates via “Admin: Add candidate” on Vote page.
5. User selects a candidate and clicks Vote; frontend calls `contract.vote(candidateId)`.
6. MetaMask prompts for transaction; after confirmation, the vote is on-chain.
7. Results page reads `getCandidates()` and `getWinner()` from the contract and displays them.

---

## Security features (in this prototype)

- One vote per wallet (enforced in the contract).
- Only the deployer can add candidates.
- Votes and counts are stored on the blockchain (immutable).
- Registration and login are off-chain (backend); only voting and reading results use the chain.

---

## Limitations of this prototype

- **Academic use only**: In-memory backend storage; no persistence, no production security.
- **Local chain**: Hardhat node is for development; no real mainnet/testnet.
- **Wallet = identity**: Anyone with a key to a registered wallet can vote; no KYC.
- **Admin key**: Deployer private key is in Hardhat’s default accounts; must be kept secret in demos.
- **No encryption of choice**: Vote choice is visible on-chain (standard for this kind of demo).
- **Gas**: Real networks would require gas fees; local Hardhat usually has no cost.

---

## Troubleshooting

- **“Contract not deployed”**: Run `npm run deploy` with the Hardhat node running, and ensure `frontend/config.js` has `CONTRACT_ADDRESS` set.
- **MetaMask “wrong network”**: Add network with RPC `http://127.0.0.1:8545` and Chain ID `31337`.
- **“Only owner can add candidates”**: Add candidates only from the MetaMask account that deployed the contract (first Hardhat account).
- **Backend not responding**: Run `npm run server` from the project root and open http://localhost:3000.

---

## License

MIT. For academic and demonstration use.
