import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import Loading from "../components/Loading";
import CollectionCard from "../components/CollectionCard";
import { errorMessage } from "../services/alertMessages";

import { useSDK } from "../hooks/useSDK";

const AddItem = () => {
    const sdk = useSDK();

    const { isConnected } = useAccount();
    const [collectionData, setCollectionData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadCollectionData = async () => {
        setIsLoading(true);

        try {
            const collections = await sdk.loadCollections();

            setCollectionData(collections);

        }
        catch (error) {
            errorMessage('Something went wrong!');
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
                        <h1>Please connect your wallet!</h1>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddItem;