/**
 * Express API routes for voter registration, login, and proxy to contract info.
 * Vote casting and results are done on-chain via frontend + MetaMask.
 */

const express = require("express");
const db = require("./database");

const router = express.Router();

// Register new voter
router.post("/register", (req, res) => {
  const { name, email, walletAddress } = req.body;
  if (!name || !email || !walletAddress) {
    return res.status(400).json({ success: false, message: "Name, email and wallet address required" });
  }
  const result = db.registerVoter(name, email, walletAddress);
  res.json(result);
});

// Login voter (verify wallet is registered)
router.post("/login", (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress) {
    return res.status(400).json({ success: false, message: "Wallet address required" });
  }
  const result = db.loginVoter(walletAddress);
  res.json(result);
});

// Candidates and results are read from blockchain via frontend.
// Backend can return contract address and ABI for frontend to use.
router.get("/config", (req, res) => {
  const contractAddress = process.env.CONTRACT_ADDRESS || "";
  res.json({ contractAddress });
});

// Optional: check if wallet is admin (Hardhat account 0)
router.get("/is-admin/:address", (req, res) => {
  const isAdmin = db.isAdmin(req.params.address);
  res.json({ isAdmin });
});

module.exports = router;
