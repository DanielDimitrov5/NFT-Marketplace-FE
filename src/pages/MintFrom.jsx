import { useState, useEffect } from 'react';
import { loadCollections } from '../services/helpers';
import { ethers } from 'ethers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from "@fortawesome/free-brands-svg-icons"
import { Link } from 'react-router-dom';

const MintFrom = () => {

    const [collections, setCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleLoadCollections = async () => {
        setIsLoading(true);
        const provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_API_KEY);

        const collections = await loadCollections(provider);

        setCollections(collections);
        setIsLoading(false);
    }

    useEffect(() => {
        handleLoadCollections();
    }, []);

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <br />
                    <h1>Mint From</h1>
                    <p>Choose a collection to mint from</p>

                    {!isLoading ? (
                        <div className="row">
                            {collections.length > 0 ? (
                                collections.map((collection, index) => (
                                    <div className="col-12 col-md-6 col-lg-4" key={index}>
                                        <Link to={`/mint-from/${collection.address}`}>
                                            <div className="card">
                                                <div className="card-body">
                                                    <h5 className="card-title">{collection.name}</h5>
                                                    <h6 className="card-subtitle mb-2 text-muted">{collection.symbol}</h6>
                                                    <h6 className="card-subtitle mb-2 text-muted">{collection.address}</h6>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12">
                                    <p>No collections found</p>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="text-center">
                            <FontAwesomeIcon icon={faEthereum} spin size="2xl" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MintFrom;