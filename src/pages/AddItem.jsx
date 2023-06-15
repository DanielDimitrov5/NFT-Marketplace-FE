import { useEffect, useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import marketplaceABI from "../contractData/abi/NFTMarketplace.json";
import { loadCollections } from "../services/helpers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from "@fortawesome/free-brands-svg-icons"
import { Button, Popover, InputNumber, Space, Form } from 'antd';

const AddItem = () => {
    const { isConnected, address } = useAccount();
    const [collectionData, setCollectionData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const marketplaceContract = {
        address: '0xa79Ef7898394B79b809043B9CDE8Dbc1f3550E02',
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

    const handleSubmit = (value) => {
        console.log(value);
    };

    useEffect(() => {
        loadCollectionData();
    }, [])


    return (
        <div className="container">
            <br />
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
                    collectionData.map((collection, index) => (
                        <div className="col-12 col-md-6 col-lg-4" key={index}>
                            <div className="card" style={{
                                clear: 'both',
                                whiteSpace: 'nowrap',
                            }}>
                                <div className="card-body">
                                    <h5 className="card-title">{collection.name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{collection.symbol}</h6>
                                    <h6 className="card-subtitle mb-2 text-muted">{collection.address}</h6>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default AddItem;