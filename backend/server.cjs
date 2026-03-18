/**
 * Express server: serves API and frontend static files.
 * Run: npm run server
 * Then open http://localhost:3000
 */

const express = require("express");
const path = require("path");
const cors = require("cors");
const routes = require("./routes.cjs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api", routes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Default route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

app.listen(PORT, () => {
  console.log(`E-Voting server running at http://localhost:${PORT}`);
  console.log("Make sure Hardhat node is running and contract is deployed.");
});

