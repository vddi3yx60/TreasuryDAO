import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Clock, Plus } from 'lucide-react';
import { useAccount } from 'wagmi';
import { BrowserProvider, Contract, formatEther } from 'ethers';
import { TREASURY_DAO_ADDRESS, TREASURY_DAO_ABI } from '@/config/contracts';
import VoteDialog from './VoteDialog';
import CreateProposalDialog from './CreateProposalDialog';
import DepositDialog from './DepositDialog';
import { useWalletClient } from 'wagmi';

interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  amount: string;
  recipient: string;
  deadline: number;
  finalized: boolean;
}

const ProposalsList = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showVoteDialog, setShowVoteDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [userDeposit, setUserDeposit] = useState<string>('0');
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const loadProposals = async () => {
    if (!walletClient) return;

    try {
      const provider = new BrowserProvider(walletClient);
      const contract = new Contract(TREASURY_DAO_ADDRESS, TREASURY_DAO_ABI, provider);

      const count = await contract.getProposalCount();
      const proposalsList: Proposal[] = [];

      for (let i = 0; i < Number(count); i++) {
        const proposal = await contract.getProposal(i);
        proposalsList.push({
          id: Number(proposal[0]),
          title: proposal[1],
          description: proposal[2],
          proposer: proposal[3],
          amount: formatEther(proposal[4]),
          recipient: proposal[5],
          deadline: Number(proposal[6]),
          finalized: proposal[7],
        });
      }

      setProposals(proposalsList);
      setLoading(false);
    } catch (error) {
      console.error('Error loading proposals:', error);
      setLoading(false);
    }
  };

  const loadUserDeposit = async () => {
    if (!address || !walletClient) return;

    try {
      const provider = new BrowserProvider(walletClient);
      const contract = new Contract(TREASURY_DAO_ADDRESS, TREASURY_DAO_ABI, provider);
      const deposit = await contract.deposits(address);
      setUserDeposit(formatEther(deposit));
    } catch (error) {
      console.error('Error loading user deposit:', error);
    }
  };

  useEffect(() => {
    if (walletClient) {
      loadProposals();
      loadUserDeposit();
    }
  }, [walletClient, address]);

  const getTimeLeft = (deadline: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = deadline - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    return `${hours} hour${hours > 1 ? 's' : ''} left`;
  };

  const handleVote = (proposal: Proposal) => {
    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    if (parseFloat(userDeposit) < 0.001) {
      alert('You need to deposit at least 0.001 ETH to vote');
      setShowDepositDialog(true);
      return;
    }

    setSelectedProposal(proposal);
    setShowVoteDialog(true);
  };

  const handleRefresh = () => {
    loadProposals();
    loadUserDeposit();
  };

  return (
    <section id="proposals" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            DAO Proposals
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Vote with encrypted ballots - your choice remains private
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {address && (
              <span>
                Your deposit: <strong>{userDeposit} ETH</strong>
                {parseFloat(userDeposit) < 0.001 && (
                  <span className="text-destructive ml-2">(Need 0.001 ETH to vote)</span>
                )}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowDepositDialog(true)}
              variant="outline"
              disabled={!address}
            >
              Deposit
            </Button>
            <Button
              onClick={() => setShowCreateDialog(true)}
              disabled={!address}
              className="bg-gradient-warm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Proposal
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading proposals...</p>
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No proposals yet. Create the first one!</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="p-8 shadow-warm hover:shadow-elevated transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge
                        variant={proposal.finalized ? 'secondary' : 'default'}
                        className="bg-gradient-warm text-primary-foreground border-0"
                      >
                        {proposal.finalized ? 'Finalized' : 'Active'}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {getTimeLeft(proposal.deadline)}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold mb-3">{proposal.title}</h3>
                    <p className="text-muted-foreground mb-4">{proposal.description}</p>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
                        <Lock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Amount: {proposal.amount} ETH</span>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <div>Recipient: {proposal.recipient.slice(0, 10)}...{proposal.recipient.slice(-8)}</div>
                      <div>Proposer: {proposal.proposer.slice(0, 10)}...{proposal.proposer.slice(-8)}</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 md:min-w-[140px]">
                    <Button
                      onClick={() => handleVote(proposal)}
                      disabled={proposal.finalized}
                      className="bg-gradient-warm hover:opacity-90 text-primary-foreground shadow-warm"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Vote
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <VoteDialog
        proposal={selectedProposal}
        open={showVoteDialog}
        onClose={() => setShowVoteDialog(false)}
        onSuccess={handleRefresh}
      />

      <CreateProposalDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handleRefresh}
      />

      <DepositDialog
        open={showDepositDialog}
        onClose={() => setShowDepositDialog(false)}
        onSuccess={handleRefresh}
      />
    </section>
  );
};

export default ProposalsList;
