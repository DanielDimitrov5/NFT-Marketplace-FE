import { useState, useEffect } from 'react';
import marketplaceABI from '../contractData/abi/NFTMarketplace.json';
import { ethers } from 'ethers';
import { erc721ABI } from 'wagmi';

const marketplaceContract = {
    address: '0xa79Ef7898394B79b809043B9CDE8Dbc1f3550E02',
    abi: marketplaceABI,
}

const Collections = () => {
    const [collections, setCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadCollections = async () => {
        setIsLoading(true);

        try {
            const provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_API_KEY);
            const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, provider);

            const count = await contract.collectionCount();
            const countArr = Array.from({ length: count.toNumber() }, (_, i) => i + 1);
            const collectionsPromises = countArr.map((collection) => contract.collections(collection));

            const collections = await Promise.all(collectionsPromises);

            const collectionContractPromises = collections.map((collection) => {
                const collectionContract = new ethers.Contract(
                    collection,
                    erc721ABI,
                    provider,
                );

                return [collectionContract.name(), collectionContract.symbol()];
            });

            const resolvedCollections = await Promise.all(
                collectionContractPromises.map(async (collectionPromises) => {
                    const [namePromise, symbolPromise] = collectionPromises;
                    const [name, symbol] = await Promise.all([namePromise, symbolPromise]);
                    return { name, symbol };
                })
            );

            setCollections(resolvedCollections);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadCollections();
    }, []);

    return (
        <div className="container">
            <br />
            <div className="row">
                <div className="col-12">
                    <h1>Collections</h1>
                </div>
            </div>
            <div className="row">
                {isLoading ? (
                    <div className="col-12">
                        <p>Loading...</p>
                    </div>
                ) : (
                    collections.map((collection, index) => (
                        <div className="col-12 col-md-6 col-lg-4" key={index}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{collection.name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{collection.symbol}</h6>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Collections;