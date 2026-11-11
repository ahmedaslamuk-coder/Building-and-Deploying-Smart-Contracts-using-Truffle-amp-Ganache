// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @notice A permanent two-option ballot for a campus print campaign.
contract PressVote {
    // IDs: 0 = Night Market, 1 = Fresh Type.
    uint256[2] private counts;
    mapping(address => bool) private voted;

    event VoteCast(address indexed voter, uint8 indexed option);

    function castVote(uint8 option) external {
        require(option < 2, "Unknown poster");
        require(!voted[msg.sender], "Wallet already voted");
        voted[msg.sender] = true;
        counts[option] += 1;
        emit VoteCast(msg.sender, option);
    }

    function getResults() external view returns (uint256[2] memory) {
        return counts;
    }

    function hasVoted(address voter) external view returns (bool) {
        return voted[voter];
    }
}
