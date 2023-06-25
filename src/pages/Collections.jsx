import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { loadCollections } from '../services/helpers';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from "@fortawesome/free-brands-svg-icons"

const Collections = () => {
    const [collections, setCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadCollectionsData = async () => {
        setIsLoading(true);

        try {
            const provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_API_KEY);

            const resolvedCollections = await loadCollections(provider);
            console.log(resolvedCollections);

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
                    <div className="text-center">
                        <FontAwesomeIcon icon={faEthereum} spin size="2xl" />
                    </div>
                ) : (
                    collections.map((collection, index) => (
                        <div className="col-12 col-md-6 col-lg-4" key={index}>
                            <div className="card">
                                <Link to={`${collection.address}`}>
                                    <div className="card-body">
                                        <h5 className="card-title">{collection.name}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">{collection.symbol}</h6>
                                        <h6 className="card-subtitle mb-2 text-muted">{collection.address}</h6>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Collections;