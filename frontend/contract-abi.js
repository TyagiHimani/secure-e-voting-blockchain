// Minimal ABI for Voting.sol (used by frontend with ethers.js)
const VOTING_ABI = [
  "function addCandidate(string memory _name) public",
  "function vote(uint256 _candidateId) public",
  "function getCandidates() public view returns (uint256[] memory ids, string[] memory names, uint256[] memory voteCounts)",
  "function getWinner() public view returns (uint256 winnerId, uint256 winnerVotes)",
  "function hasVoted(address) public view returns (bool)",
  "function candidatesCount() public view returns (uint256)",
  "function owner() public view returns (address)"
];
