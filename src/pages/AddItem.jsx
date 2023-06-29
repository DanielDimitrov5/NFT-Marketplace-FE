import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

import { loadCollections } from "../services/helpers";
import Loading from "../components/Loading";
import CollectionCard from "../components/CollectionCard";

const AddItem = () => {
    const { isConnected } = useAccount();
    const [collectionData, setCollectionData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadCollectionData = async () => {
        setIsLoading(true);

        try {
            const provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_INFURA_KEY);

            const collections = await loadCollections(provider);

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
                            <Loading />
                        ) : (

                            collectionData?.map((collection, index) => (
                                <CollectionCard collection={collection} index={index} />
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