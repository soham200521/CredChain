// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @dev CredChain stores credit scores mapped to wallet addresses.
 * Only the contract owner can update scores.
 * Anyone can read scores.
 */
contract CredChain is Ownable {
    /// @notice Mapping of user wallet address to their credit score
    mapping(address => uint256) private _scores;

    /// @notice Emitted when a score is updated
    /// @param user The address whose score was updated
    /// @param newScore The new credit score
    event ScoreUpdated(address indexed user, uint256 newScore);
    
    // Add this constructor
    constructor() Ownable(msg.sender) {
        // This makes the deployer (you) the owner
    }

    // Rest of your contract remains the same
    function updateScore(address user, uint256 score) external onlyOwner {
        _scores[user] = score;
        emit ScoreUpdated(user, score);
    }

    function getScore(address user) external view returns (uint256) {
        return _scores[user];
    }
}
