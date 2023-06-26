import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ItemCards from '../components/ItemCards';
import { loadItems } from '../services/helpers';
import { useAccount } from 'wagmi';

const NETWORK = process.env.REACT_APP_NETWORK;
const API_KEY = process.env.REACT_APP_API_KEY;

function Home() {

    const [contractData, setContractData] = useState({});
    const [isLoadingContractData, setIsLoadingContractData] = useState(true);
    const { address } = useAccount();

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
