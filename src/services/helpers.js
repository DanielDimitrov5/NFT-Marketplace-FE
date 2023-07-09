import marketplaceABI from '../contractData/abi/NFTMarketplace.json';
import { providers } from 'ethers';

export const marketplaceContract = {
    address: '0xf4351BA9Ca701Cf689442833CDA5F7FF18C2e00C',
    abi: marketplaceABI,
}

export const infuraProvider = new providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_API_KEY);