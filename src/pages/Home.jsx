import React, { useState, useEffect, useCallback } from 'react';
import marketplaceABI from '../contractData/abi/NFTMarketplace.json';
import { ethers } from 'ethers';
import ItemCards from '../components/ItemCards';
import { loadItems } from '../services/helpers';
import { useAccount } from 'wagmi';

const marketplaceContract = {
    address: '0x283986BAd88488eFa031AD6734926401c5Cfe127',
    abi: marketplaceABI,
}

const NETWORK = process.env.REACT_APP_NETWORK;
const API_KEY = process.env.REACT_APP_API_KEY;

function Home() {

    const [contractData, setContractData] = useState({});
    const [isLoadingContractData, setIsLoadingContractData] = useState(true);
    const { isConnected, address } = useAccount();

    const getContractData = async () => {
        setIsLoadingContractData(true);

        const provider = new ethers.providers.InfuraProvider(NETWORK, API_KEY);

        const { items, metadataArrModified } = await loadItems(provider);

        const filteredItems = items.filter(item => item.owner !== address);
        const filteredMetadata = metadataArrModified.filter(item => item.owner !== address);

        setContractData({ ...contractData, items: filteredItems, metaData: filteredMetadata });
        setIsLoadingContractData(false);
    };

    useEffect(() => {
        getContractData();
    }, [address]);

    return <ItemCards contractData={contractData} isLoadingContractData={isLoadingContractData} />;
}

export default Home;
