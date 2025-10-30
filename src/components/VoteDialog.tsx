import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useAccount, useWalletClient } from 'wagmi';
import { BrowserProvider, Contract } from 'ethers';
import { TREASURY_DAO_ADDRESS, TREASURY_DAO_ABI } from '@/config/contracts';
import { encryptVote } from '@/lib/fhe';

interface Proposal {
  id: number;
  title: string;
  description: string;
  amount: string;
}

interface VoteDialogProps {
  proposal: Proposal | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const VoteDialog = ({ proposal, open, onClose, onSuccess }: VoteDialogProps) => {
  const [voteChoice, setVoteChoice] = useState<'yes' | 'no' | ''>('');
  const [isVoting, setIsVoting] = useState(false);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const handleVote = async () => {
    if (!voteChoice) {
      toast.error('Please select Yes or No');
      return;
    }

    if (!proposal || !address || !walletClient) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsVoting(true);

    try {
      toast.info('🔐 Encrypting Vote', {
        description: 'Encrypting your vote using FHE...',
      });

      // Encrypt vote: 1 = yes, 0 = no
      const voteValue: 0 | 1 = voteChoice === 'yes' ? 1 : 0;
      const { encryptedVote, proof } = await encryptVote(
        TREASURY_DAO_ADDRESS,
        address,
        voteValue
      );

      toast.info('📝 Submitting Vote', {
        description: 'Sending encrypted vote to blockchain...',
      });

      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new Contract(TREASURY_DAO_ADDRESS, TREASURY_DAO_ABI, signer);

      const tx = await contract.vote(proposal.id, encryptedVote, proof);
      const receipt = await tx.wait();

      toast.success('Vote submitted!', {
        description: (
          <div className="flex flex-col gap-1">
            <span>Your encrypted vote has been recorded</span>
            <a
              href={`https://sepolia.etherscan.io/tx/${receipt.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:text-blue-600 underline"
            >
              View transaction →
            </a>
          </div>
        ),
      });

      setVoteChoice('');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Vote error:', error);
      toast.error('Failed to submit vote', {
        description: error.message || 'Please try again',
      });
    } finally {
      setIsVoting(false);
    }
  };

  if (!proposal) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Cast Encrypted Vote
          </DialogTitle>
          <DialogDescription>
            {proposal.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Amount:</strong> {proposal.amount} ETH
            </p>
            <p className="text-sm text-muted-foreground">
              {proposal.description}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Privacy Protected</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your vote will be encrypted using Fully Homomorphic Encryption (FHE)
              before being stored on-chain. Nobody can see your vote until the proposal is finalized.
            </p>
          </div>

          <div className="space-y-3">
            <Label>Select your vote:</Label>
            <RadioGroup value={voteChoice} onValueChange={(val) => setVoteChoice(val as 'yes' | 'no')}>
              <div className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:border-primary transition-colors">
                <RadioGroupItem value="yes" id="vote-yes" />
                <Label htmlFor="vote-yes" className="flex-1 cursor-pointer">
                  ✅ Vote FOR
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:border-primary transition-colors">
                <RadioGroupItem value="no" id="vote-no" />
                <Label htmlFor="vote-no" className="flex-1 cursor-pointer">
                  ❌ Vote AGAINST
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isVoting}>
            Cancel
          </Button>
          <Button
            onClick={handleVote}
            disabled={!voteChoice || isVoting}
            className="bg-gradient-warm"
          >
            {isVoting ? 'Voting...' : 'Submit Encrypted Vote'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VoteDialog;
