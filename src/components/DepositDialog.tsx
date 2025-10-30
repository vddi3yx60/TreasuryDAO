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
import { toast } from 'sonner';
import { useAccount } from 'wagmi';
import { parseEther } from 'ethers';
import { TREASURY_DAO_ADDRESS, TREASURY_DAO_ABI } from '@/config/contracts';
import { useWalletClient } from 'wagmi';
import { BrowserProvider, Contract } from 'ethers';

interface DepositDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DepositDialog = ({ open, onClose, onSuccess }: DepositDialogProps) => {
  const [amount, setAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!address || !walletClient) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsDepositing(true);

    try {
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new Contract(TREASURY_DAO_ADDRESS, TREASURY_DAO_ABI, signer);

      toast.info('Depositing...', {
        description: `Sending ${amount} ETH to treasury`,
      });

      const tx = await contract.deposit({
        value: parseEther(amount),
      });

      await tx.wait();

      toast.success('Deposit successful!', {
        description: `${amount} ETH deposited to treasury`,
      });

      setAmount('');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Deposit error:', error);
      toast.error('Deposit failed', {
        description: error.message || 'Please try again',
      });
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit to Treasury</DialogTitle>
          <DialogDescription>
            Deposit ETH to gain voting rights. Minimum deposit: 0.001 ETH
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              step="0.001"
              min="0.001"
              placeholder="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isDepositing}
            />
            <p className="text-sm text-muted-foreground">
              Your deposit will be recorded on-chain
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDepositing}>
            Cancel
          </Button>
          <Button
            onClick={handleDeposit}
            disabled={isDepositing || !amount}
            className="bg-gradient-warm"
          >
            {isDepositing ? 'Depositing...' : 'Deposit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepositDialog;
