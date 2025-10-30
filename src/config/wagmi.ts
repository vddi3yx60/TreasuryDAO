import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'TreasuryDAO',
  projectId: process.env.VITE_WALLETCONNECT_PROJECT_ID || '0123456789abcdef0123456789abcdef', // Fallback for development
  chains: [sepolia],
  ssr: false,
});
