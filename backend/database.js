/**
 * Simple in-memory storage for voters and session.
 * In production you would use a real database.
 */

const voters = new Map(); // walletAddress -> { name, email, walletAddress }
let isAdminSet = false;
const ADMIN_WALLET = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Hardhat account 0

function registerVoter(name, email, walletAddress) {
  const addr = walletAddress.toLowerCase();
  if (voters.has(addr)) {
    return { success: false, message: "Wallet already registered" };
  }
  voters.set(addr, { name, email, walletAddress: addr });
  return { success: true, message: "Registration successful" };
}

function loginVoter(walletAddress) {
  const addr = walletAddress.toLowerCase();
  const voter = voters.get(addr);
  if (!voter) {
    return { success: false, message: "Wallet not registered" };
  }
  return { success: true, voter };
}

function getAllVoters() {
  return Array.from(voters.values());
}

function isAdmin(walletAddress) {
  return walletAddress && walletAddress.toLowerCase() === ADMIN_WALLET.toLowerCase();
}

module.exports = {
  registerVoter,
  loginVoter,
  getAllVoters,
  isAdmin,
};
