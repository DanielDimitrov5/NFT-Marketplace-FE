import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { loadCollections } from '../services/helpers';
import Loading from '../components/Loading';
import CollectionCard from '../components/CollectionCard';

const Collections = () => {
    const [collections, setCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadCollectionsData = async () => {
        setIsLoading(true);

        try {
            const provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_API_KEY);

            const resolvedCollections = await loadCollections(provider);

            setCollections(resolvedCollections);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadCollectionsData();
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
                    <Loading />
                ) : (
                    collections.map((collection, index) => (
                        <CollectionCard collection={collection} index={index} />
                    ))
                )}
            </div>
        </div>
    )
}

export default Collections;