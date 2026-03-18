// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Voting
 * @dev Blockchain-based secure e-voting - one voter one vote, immutable storage
 */
contract Voting {
    // Candidate structure: id, name, vote count
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    // Store candidates by id (1-indexed for simplicity)
    mapping(uint256 => Candidate) public candidates;
    uint256 public candidatesCount;

    // Prevent duplicate voting: wallet => has voted
    mapping(address => bool) public hasVoted;

    // Owner (deployer) can add candidates
    address public owner;

    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event CandidateAdded(uint256 indexed id, string name);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Add a new candidate (admin only)
     */
    function addCandidate(string memory _name) public onlyOwner {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    /**
     * @dev Cast a vote for a candidate
     * Enforces: one vote per voter, candidate must exist
     */
    function vote(uint256 _candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit VoteCast(msg.sender, _candidateId);
    }

    /**
     * @dev Get all candidates (id, name, voteCount)
     */
    function getCandidates() public view returns (
        uint256[] memory ids,
        string[] memory names,
        uint256[] memory voteCounts
    ) {
        ids = new uint256[](candidatesCount);
        names = new string[](candidatesCount);
        voteCounts = new uint256[](candidatesCount);

        for (uint256 i = 1; i <= candidatesCount; i++) {
            ids[i - 1] = candidates[i].id;
            names[i - 1] = candidates[i].name;
            voteCounts[i - 1] = candidates[i].voteCount;
        }
    }

    /**
     * @dev Get winner(s) - candidate(s) with highest vote count
     * Returns first winner id; in tie returns lowest id with max votes
     */
    function getWinner() public view returns (uint256 winnerId, uint256 winnerVotes) {
        require(candidatesCount > 0, "No candidates");
        winnerId = 1;
        winnerVotes = candidates[1].voteCount;

        for (uint256 i = 2; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > winnerVotes) {
                winnerId = i;
                winnerVotes = candidates[i].voteCount;
            }
        }
    }

    /**
     * @dev Check if an address has voted
     */
    function hasAddressVoted(address _voter) public view returns (bool) {
        return hasVoted[_voter];
    }
}
