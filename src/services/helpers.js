import marketplaceABI from '../contractData/abi/NFTMarketplace.json';
import { providers } from 'ethers';

export const marketplaceContract = {
    address: '0x8C43a9eF5291E8F2184df0A05c0b7d9978e230CA',
    abi: marketplaceABI,
}

export const infuraProvider = new providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_API_KEY);