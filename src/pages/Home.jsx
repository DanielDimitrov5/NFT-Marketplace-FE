import React, { useState, useEffect, useCallback } from 'react';
import marketplaceABI from '../contractData/abi/NFTMarketplace.json';
import { ethers } from 'ethers';
import { erc721ABI } from 'wagmi';
import axios from 'axios';
import ItemCards from '../components/ItemCards';
import { loadItems } from '../services/helpers';

const marketplaceContract = {
    address: '0x283986BAd88488eFa031AD6734926401c5Cfe127',
    abi: marketplaceABI,
}

const NETWORK = process.env.REACT_APP_NETWORK;
const API_KEY = process.env.REACT_APP_API_KEY;

function Home() {

    const [contract, setContract] = useState();
    const [contractData, setContractData] = useState({});
    const [isLoadingContractData, setIsLoadingContractData] = useState(true);

    const getContractData = async () => {
        setIsLoadingContractData(true);

        const provider = new ethers.providers.InfuraProvider(NETWORK, API_KEY);
        const contract = new ethers.Contract(
            marketplaceContract.address,
            marketplaceContract.abi,
            provider,
        );

        const { items, metadataArrModified } = await loadItems(provider);

        setContractData({ ...contractData, items, metaData: metadataArrModified });
        setIsLoadingContractData(false);
    };

    useEffect(() => {
        getContractData();
    }, []);

    return <ItemCards contractData={contractData} isLoadingContractData={isLoadingContractData} />;
}

export default Home;
