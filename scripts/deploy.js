import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

async function main() {
  const { viem, networkName } = await hre.network.connect();
  console.log(`Deploying Voting.sol to ${networkName}...`);

  const voting = await viem.deployContract("Voting");
  const address = voting.address;
  console.log("Voting contract deployed to:", address);

  // Write address to frontend config so app works without manual copy
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const configPath = path.join(__dirname, "..", "frontend", "config.js");
  const configContent = `// Auto-updated by deploy script\nconst CONTRACT_ADDRESS = "${address}";\n`;
  fs.writeFileSync(configPath, configContent);
  console.log("Updated frontend/config.js with contract address.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
