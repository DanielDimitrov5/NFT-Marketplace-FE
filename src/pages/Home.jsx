import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import { useContractRead, useContractReads, useContractInfiniteReads, paginatedIndexesConfig } from 'wagmi';
import marketplaceABI from '../abi/NFTMarketplace.json';
import { ethers } from 'ethers';
import { erc721ABI } from 'wagmi';
import axios from 'axios';
import ItemCards from '../components/ItemCards';



const marketplaceContract = {
    address: '0xa79Ef7898394B79b809043B9CDE8Dbc1f3550E02',
    abi: marketplaceABI,
}
const NETWORK = process.env.REACT_APP_NETWORK;
const API_KEY = process.env.REACT_APP_API_KEY;
const IPFS_PROVIDER = process.env.REACT_APP_IPFS_PROVIDER;

function Home() {

    // Contract states
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

        const count = await contract.itemCount();

        const countArr = Array.from({ length: count.toNumber() }, (_, i) => i + 1);

        const itemsPromises = countArr.map((item) => contract.items(item));

        const items = await Promise.all(itemsPromises);

        const URIPrimises = items.map((item) => {
            const nftContract = new ethers.Contract(
                item.nftContract,
                erc721ABI,
                provider,
            );
            const tokenUri = nftContract.tokenURI(item.tokenId);
            return tokenUri;
        });


        const URIs = await Promise.all(URIPrimises);

        const URIsModified = URIs.map((uri) => {
            return uri.replace('ipfs://', IPFS_PROVIDER);
        });

        const metadataPromises = URIsModified.map((uri) => {
            return axios.get(uri);
        });

        const metadataArr = await Promise.all(metadataPromises);

        const metadataArrModified = metadataArr.map((metadata) => {
            return {
                ...metadata,
                name: metadata.data.name,
                image: metadata.data.image.replace('ipfs://', IPFS_PROVIDER),
                description: metadata.data.description,
            };
        });


        setContractData({ ...contractData, items, metaData: metadataArrModified });
        setIsLoadingContractData(false);
    };



    useEffect(() => {
        getContractData();
    }, [contract]);

    return <ItemCards contractData={contractData} isLoadingContractData={isLoadingContractData} />;
}

export default Home;
