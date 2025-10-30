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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAccount, useWalletClient } from 'wagmi';
import { parseEther, BrowserProvider, Contract } from 'ethers';
import { TREASURY_DAO_ADDRESS, TREASURY_DAO_ABI } from '@/config/contracts';

interface CreateProposalDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateProposalDialog = ({ open, onClose, onSuccess }: CreateProposalDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [votingDays, setVotingDays] = useState('7');
  const [isCreating, setIsCreating] = useState(false);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const handleCreate = async () => {
    if (!title || !description || !amount || !recipient || !votingDays) {
      toast.error('Please fill in all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    if (!address || !walletClient) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsCreating(true);

    try {
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new Contract(TREASURY_DAO_ADDRESS, TREASURY_DAO_ABI, signer);

      toast.info('Creating proposal...', {
        description: 'Sending transaction',
      });

      const tx = await contract.createProposal(
        title,
        description,
        parseEther(amount),
        recipient,
        parseInt(votingDays)
      );

      await tx.wait();

      toast.success('Proposal created!', {
        description: `Voting period: ${votingDays} days`,
      });

      setTitle('');
      setDescription('');
      setAmount('');
      setRecipient('');
      setVotingDays('7');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Create proposal error:', error);
      toast.error('Failed to create proposal', {
        description: error.message || 'Please try again',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Proposal</DialogTitle>
          <DialogDescription>
            Create a funding proposal for the DAO treasury
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Marketing Campaign Budget"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isCreating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the proposal..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isCreating}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (ETH) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.001"
                min="0.001"
                placeholder="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isCreating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="votingDays">Voting Period (days) *</Label>
              <Input
                id="votingDays"
                type="number"
                min="1"
                max="30"
                placeholder="7"
                value={votingDays}
                onChange={(e) => setVotingDays(e.target.value)}
                disabled={isCreating}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address *</Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isCreating}
            />
            <p className="text-sm text-muted-foreground">
              Address that will receive funds if proposal passes
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating || !title || !description || !amount || !recipient}
            className="bg-gradient-warm"
          >
            {isCreating ? 'Creating...' : 'Create Proposal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProposalDialog;
