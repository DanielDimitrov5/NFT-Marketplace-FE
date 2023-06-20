import { useEffect, useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import marketplaceABI from "../contractData/abi/NFTMarketplace.json";
import { loadCollections } from "../services/helpers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from "@fortawesome/free-brands-svg-icons"
import { Link } from "react-router-dom";

const AddItem = () => {
    const { isConnected, address } = useAccount();
    const [collectionData, setCollectionData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const marketplaceContract = {
        address: '0x283986BAd88488eFa031AD6734926401c5Cfe127',
        abi: marketplaceABI,
    }

    const loadCollectionData = async () => {
        setIsLoading(true);

        try {
            const provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_INFURA_KEY);
            const marketplace = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, provider);

            const collections = await loadCollections(marketplace);

            setCollectionData(collections);

        }
        catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadCollectionData();
    }, [])


    return (
        <div className="container">
            <br />
            {isConnected ? (
                <>
                    <div className="row">
                        <div className="col-12">
                            <h1>Choose collection to add item from</h1>
                        </div>
                    </div>
                    <div className="row">
                        {isLoading ? (
                            <div className="text-center">
                                <FontAwesomeIcon icon={faEthereum} spin size="2xl" />
                            </div>
                        ) : (

                            collectionData?.map((collection, index) => (
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
                </>
            ) : (
                <div className="row">
                    <div className="col-12">
                        <h1>Please connect your wallet</h1>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddItem;