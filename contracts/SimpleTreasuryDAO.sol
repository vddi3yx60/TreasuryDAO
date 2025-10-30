// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Simple DAO Treasury with Encrypted Votes
/// @notice Simplified DAO where deposits and proposals are plaintext, but votes are encrypted
contract SimpleTreasuryDAO is SepoliaConfig {
    address public owner;
    uint256 public minDepositToVote; // minimum deposit required to vote

    struct Proposal {
        uint256 id;
        string title;
        string description;
        address proposer;
        uint256 amount; // plaintext amount
        address recipient;
        uint256 deadline;
        euint64 encryptedYesVotes; // encrypted yes votes
        euint64 encryptedNoVotes;  // encrypted no votes
        bool finalized;
    }

    Proposal[] public proposals;
    mapping(address => uint256) public deposits; // plaintext deposits
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event ProposalCreated(uint256 indexed id, string title, uint256 amount, address recipient);
    event VoteCast(uint256 indexed proposalId, address indexed voter);
    event ProposalFinalized(uint256 indexed id);

    error InsufficientDeposit();
    error AlreadyVoted();
    error ProposalNotFound();
    error VotingEnded();
    error NotProposer();
    error InvalidAmount();
    error InvalidRecipient();
    error InvalidDeadline();
    error NotFinalized();
    error AlreadyFinalized();

    constructor(uint256 _minDepositToVote) {
        owner = msg.sender;
        minDepositToVote = _minDepositToVote;
    }

    /// @notice Deposit funds to gain voting rights (plaintext)
    function deposit() external payable {
        if (msg.value == 0) revert InvalidAmount();
        deposits[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    /// @notice Withdraw deposited funds
    function withdraw(uint256 amount) external {
        if (deposits[msg.sender] < amount) revert InvalidAmount();
        deposits[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawn(msg.sender, amount);
    }

    /// @notice Create a new proposal (plaintext)
    function createProposal(
        string calldata title,
        string calldata description,
        uint256 amount,
        address recipient,
        uint256 votingPeriodDays
    ) external returns (uint256) {
        if (deposits[msg.sender] < minDepositToVote) revert InsufficientDeposit();
        if (amount == 0) revert InvalidAmount();
        if (recipient == address(0)) revert InvalidRecipient();
        if (votingPeriodDays == 0 || votingPeriodDays > 30) revert InvalidDeadline();

        uint256 proposalId = proposals.length;

        Proposal memory newProposal;
        newProposal.id = proposalId;
        newProposal.title = title;
        newProposal.description = description;
        newProposal.proposer = msg.sender;
        newProposal.amount = amount;
        newProposal.recipient = recipient;
        newProposal.deadline = block.timestamp + (votingPeriodDays * 1 days);
        newProposal.encryptedYesVotes = FHE.asEuint64(0);
        newProposal.encryptedNoVotes = FHE.asEuint64(0);
        newProposal.finalized = false;

        proposals.push(newProposal);

        // Allow contract to read encrypted votes
        FHE.allowThis(proposals[proposalId].encryptedYesVotes);
        FHE.allowThis(proposals[proposalId].encryptedNoVotes);

        emit ProposalCreated(proposalId, title, amount, recipient);
        return proposalId;
    }

    /// @notice Cast an encrypted vote (1 = yes, 0 = no)
    function vote(
        uint256 proposalId,
        externalEuint64 encryptedVote,
        bytes calldata inputProof
    ) external {
        if (proposalId >= proposals.length) revert ProposalNotFound();
        if (deposits[msg.sender] < minDepositToVote) revert InsufficientDeposit();
        if (hasVoted[proposalId][msg.sender]) revert AlreadyVoted();

        Proposal storage proposal = proposals[proposalId];
        if (block.timestamp > proposal.deadline) revert VotingEnded();

        // Decrypt the vote input (should be 0 or 1)
        euint64 voteValue = FHE.fromExternal(encryptedVote, inputProof);

        // Add to yes votes: if vote == 1, add 1, else add 0
        euint64 yesIncrement = FHE.select(FHE.eq(voteValue, FHE.asEuint64(1)), FHE.asEuint64(1), FHE.asEuint64(0));
        proposal.encryptedYesVotes = FHE.add(proposal.encryptedYesVotes, yesIncrement);

        // Add to no votes: if vote == 0, add 1, else add 0
        euint64 noIncrement = FHE.select(FHE.eq(voteValue, FHE.asEuint64(0)), FHE.asEuint64(1), FHE.asEuint64(0));
        proposal.encryptedNoVotes = FHE.add(proposal.encryptedNoVotes, noIncrement);

        FHE.allowThis(proposal.encryptedYesVotes);
        FHE.allowThis(proposal.encryptedNoVotes);

        hasVoted[proposalId][msg.sender] = true;

        emit VoteCast(proposalId, msg.sender);
    }

    /// @notice Finalize proposal to allow vote decryption (owner or proposer only)
    function finalizeProposal(uint256 proposalId) external {
        if (proposalId >= proposals.length) revert ProposalNotFound();

        Proposal storage proposal = proposals[proposalId];
        if (proposal.finalized) revert AlreadyFinalized();
        if (msg.sender != owner && msg.sender != proposal.proposer) revert NotProposer();
        if (block.timestamp <= proposal.deadline) revert VotingEnded();

        proposal.finalized = true;

        // Allow owner and proposer to decrypt the results
        FHE.allow(proposal.encryptedYesVotes, owner);
        FHE.allow(proposal.encryptedYesVotes, proposal.proposer);
        FHE.allow(proposal.encryptedNoVotes, owner);
        FHE.allow(proposal.encryptedNoVotes, proposal.proposer);

        emit ProposalFinalized(proposalId);
    }

    /// @notice Get encrypted yes votes (only decryptable after finalization)
    function getYesVotes(uint256 proposalId) external view returns (euint64) {
        if (proposalId >= proposals.length) revert ProposalNotFound();
        Proposal storage proposal = proposals[proposalId];
        if (!proposal.finalized) revert NotFinalized();
        return proposal.encryptedYesVotes;
    }

    /// @notice Get encrypted no votes (only decryptable after finalization)
    function getNoVotes(uint256 proposalId) external view returns (euint64) {
        if (proposalId >= proposals.length) revert ProposalNotFound();
        Proposal storage proposal = proposals[proposalId];
        if (!proposal.finalized) revert NotFinalized();
        return proposal.encryptedNoVotes;
    }

    /// @notice Get proposal count
    function getProposalCount() external view returns (uint256) {
        return proposals.length;
    }

    /// @notice Get proposal details
    function getProposal(uint256 proposalId) external view returns (
        uint256 id,
        string memory title,
        string memory description,
        address proposer,
        uint256 amount,
        address recipient,
        uint256 deadline,
        bool finalized
    ) {
        if (proposalId >= proposals.length) revert ProposalNotFound();
        Proposal storage p = proposals[proposalId];
        return (p.id, p.title, p.description, p.proposer, p.amount, p.recipient, p.deadline, p.finalized);
    }

    /// @notice Update minimum deposit requirement (owner only)
    function updateMinDeposit(uint256 newMinDeposit) external {
        require(msg.sender == owner, "Not owner");
        minDepositToVote = newMinDeposit;
    }
}
