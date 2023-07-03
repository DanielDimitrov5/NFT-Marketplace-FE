import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Loading from '../components/Loading';
import { useAccount } from 'wagmi';
import CollectionCard from '../components/CollectionCard';
import { useSDK } from '../hooks/useSDK';

import nftABI from '../contractData/abi/NFT.json';

const MintFrom = () => {
    const sdk = useSDK();

    const [collections, setCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { isConnected, address } = useAccount();

    const handleLoadCollections = async () => {
        setIsLoading(true);

        const provider = new ethers.providers.InfuraProvider(
            process.env.REACT_APP_NETWORK,
            process.env.REACT_APP_API_KEY
        );

        const collections = await sdk.loadCollections();

        const ownersPromises = collections.map((collection) => {
            const contract = new ethers.Contract(collection.address, nftABI, provider);
            const owner = contract.owner();
            return owner;
        });

        const owners = await Promise.all(ownersPromises);

        const filteredCollections = collections.filter((collection, index) => {
            return owners[index] === address;
        });

        setCollections(filteredCollections);
        setIsLoading(false);
    };


    useEffect(() => {
        handleLoadCollections();
    }, [address]);

    return (
        <div className="container">
            {!isConnected ? (
                <div className="row">
                    <div className="row">
                        <div className="col-12">
                            <br />
                            <h1>Please connect your wallet</h1>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="row">
                    <div className="col-12">
                        <br />
                        <h1>Mint From</h1>
                        <p>Choose a collection to mint from</p>

                        {!isLoading ? (
                            <div className="row">
                                {collections.length > 0 ? (
                                    collections.map((collection, index) => (
                                        <CollectionCard collection={collection} key={index} />
                                    ))
                                ) : (
                                    <div className="col-12">
                                        <p>No collections found</p>
                                    </div>
                                )}

                            </div>
                        ) : (
                            <Loading />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MintFrom;