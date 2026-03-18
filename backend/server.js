/**
 * Express server: serves API and frontend static files.
 * Run: node backend/server.js
 * Then open http://localhost:3000
 */

const express = require("express");
const path = require("path");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api", routes);

// Serve frontend static files (so we can use fetch and avoid CORS with MetaMask)
app.use(express.static(path.join(__dirname, "..", "frontend")));

// SPA-style: all other routes serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

app.listen(PORT, () => {
  console.log(`E-Voting server running at http://localhost:${PORT}`);
  console.log("Make sure Hardhat node is running and contract is deployed.");
});
