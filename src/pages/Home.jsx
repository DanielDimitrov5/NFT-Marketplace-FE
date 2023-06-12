import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import { useContractRead, useContractReads, useContractInfiniteReads, paginatedIndexesConfig } from 'wagmi';
import marketplaceABI from '../abi/NFTMarketplace.json';
import { ethers } from 'ethers';
import { erc721ABI } from 'wagmi';


const marketplaceContract = {
    address: '0xa79Ef7898394B79b809043B9CDE8Dbc1f3550E02',
    abi: marketplaceABI,
}
const NETWORK = 'sepolia';
const API_KEY = '09755767452a49d3a5b3f9b84d9db6c9';
const IPFS_PROVIDER = 'https://charity-file-storage.infura-ipfs.io/ipfs/';

function Home() {

    // Contract states
    const [contract, setContract] = useState();
    const [contractData, setContractData] = useState({});
    const [isLoadingContractData, setIsLoadingContractData] = useState(true);

    const getContractData = async () => {
        setIsLoadingContractData(true);

        const provider = new ethers.providers.InfuraProvider(NETWORK, API_KEY);
        const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, provider);
        setContract(contract);

        const count = await contract.itemCount();

        const countArr = Array.from({ length: count.toNumber() }, (_, i) => i + 1);

        const itemsArr = countArr.map((i) => contract.items(i));

        const URIs = [];

        const items = await Promise.all(
            itemsArr.map(async (item) => {
                const itemData = await item;
                const nftContract = new ethers.Contract(itemData.nftContract, erc721ABI, provider);
                const tokenUri = nftContract.tokenURI(itemData.tokenId);
                URIs.push(tokenUri);

                return itemData;
            })
        );

        const metaData = await Promise.all(
            URIs.map(async (uri) => {
                const URI = (await uri).replace('ipfs://', IPFS_PROVIDER);
                const response = await fetch(URI);
                const data = await response.json();
                data.image = data.image.replace('ipfs://', IPFS_PROVIDER);
                return data;
            })
        );

        setContractData({ ...contractData, items, metaData });
        setIsLoadingContractData(false);
    };

    useEffect(() => {
        getContractData();
    }, []);

    return (
        <div className="container my-5">
            {isLoadingContractData ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                        <div />
                    </div>
                </div>
            ) : (
                <div className="row">
                    {contractData.items.map((item, i) => (
                        <div className="col-md-4" key={i}>
                            <div className="card mb-4">
                                <img
                                    src={contractData.metaData[i].image}
                                    className="card-img-top"
                                    alt="..."
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{contractData.metaData[i].name}</h5>
                                    <p className="card-text">{contractData.metaData[i].description}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="btn-group">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                            >
                                                View
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        <small className="text-muted">{ethers.utils.formatEther(item.price)} ETH</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;
