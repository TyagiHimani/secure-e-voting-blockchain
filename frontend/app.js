/**
 * Shared logic: MetaMask connection, contract interaction via ethers.js
 * CONTRACT_ADDRESS must be set in config.js after deploying the contract.
 */

const CHAIN_ID = "0x7a69"; // Hardhat localhost 31337 in hex

// Get contract instance (read-only for view functions)
function getContract() {
  if (typeof CONTRACT_ADDRESS === "undefined" || !CONTRACT_ADDRESS) {
    throw new Error("Contract not deployed. Set CONTRACT_ADDRESS in config.js");
  }
  if (typeof ethers === "undefined") throw new Error("ethers.js not loaded");
  const provider = new ethers.BrowserProvider(window.ethereum);
  return new ethers.Contract(CONTRACT_ADDRESS, VOTING_ABI, provider);
}

// Get contract with signer (for transactions: vote, addCandidate)
async function getContractWithSigner() {
  if (typeof CONTRACT_ADDRESS === "undefined" || !CONTRACT_ADDRESS) {
    throw new Error("Contract not deployed. Set CONTRACT_ADDRESS in config.js");
  }
  if (typeof ethers === "undefined") throw new Error("ethers.js not loaded");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, VOTING_ABI, signer);
}

// Connect MetaMask and switch to Hardhat localhost
async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed. Please install MetaMask.");
  }
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  if (!accounts.length) throw new Error("No account selected");
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAIN_ID }],
    });
  } catch (e) {
    // Chain not added; add Hardhat local
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: CHAIN_ID,
        chainName: "Hardhat Local",
        rpcUrls: ["http://127.0.0.1:8545"],
      }],
    });
  }
  return accounts[0];
}

// Get current account
async function getCurrentAccount() {
  if (!window.ethereum) return null;
  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  return accounts[0] || null;
}

// Load candidates from blockchain
async function loadCandidates() {
  const contract = getContract();
  const [ids, names, voteCounts] = await contract.getCandidates();
  return ids.map((id, i) => ({
    id: Number(id),
    name: names[i],
    voteCount: Number(voteCounts[i]),
  }));
}

// Cast vote (transaction)
async function castVote(candidateId) {
  const contract = await getContractWithSigner();
  const tx = await contract.vote(candidateId);
  await tx.wait();
}

// Check if current address has voted
async function hasCurrentUserVoted() {
  const account = await getCurrentAccount();
  if (!account) return false;
  const contract = getContract();
  return await contract.hasVoted(account);
}

// Add candidate (admin only)
async function addCandidate(name) {
  const contract = await getContractWithSigner();
  const tx = await contract.addCandidate(name);
  await tx.wait();
}

// Get winner from contract
async function getWinner() {
  const contract = getContract();
  const [winnerId, winnerVotes] = await contract.getWinner();
  return { id: Number(winnerId), votes: Number(winnerVotes) };
}

// Check if current account is contract owner
async function isOwner() {
  const account = await getCurrentAccount();
  if (!account) return false;
  const contract = getContract();
  const owner = await contract.owner();
  return owner.toLowerCase() === account.toLowerCase();
}
