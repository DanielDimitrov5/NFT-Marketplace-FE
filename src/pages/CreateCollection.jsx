import { useState } from "react";
import { useAccount } from "wagmi";
import { successMessage, errorMessage } from "../services/alertMessages";
import { useSDK } from "../hooks/useSDK";

const CreateCollection = () => {
    const sdk = useSDK();

    const { isConnected } = useAccount();

    const [collectionName, setCollectionName] = useState("");
    const [collectionSymbol, setCollectionSymbol] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const deployNFTCollection = async () => {
        setIsLoading(true);

        try {
            const nft = await sdk.deployNFTCollection(collectionName, collectionSymbol);

            await sdk.addExistingCollection(nft.address);

            successMessage("Collection created successfully!");
        } catch (error) {
            errorMessage("Something went wrong!");
            console.error(error);
        }
        finally {
            setCollectionName("");
            setCollectionSymbol("");
            setIsLoading(false);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        deployNFTCollection();
    }

    const handleCollectionNameChange = (event) => {
        setCollectionName(event.target.value);
    }

    const handleCollectionSymbolChange = (event) => {
        setCollectionSymbol(event.target.value);
    }

    return (
        <>
            <br />
            {isConnected ? (
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h1>Create a new NFT collection</h1>
                            <br />
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="collectionName" className="form-label">NFT Collection name</label>
                                    <input type="text" className="form-control" id="collectionName" value={collectionName} onChange={handleCollectionNameChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="collectionDescription" className="form-label">NFT Collection symbol</label>
                                    <input className="form-control" id="collectionDescription" rows="3" value={collectionSymbol} onChange={handleCollectionSymbolChange}></input>
                                </div>
                                {isLoading ? (
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    <button type="submit" className="btn btn-primary">Create</button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

            ) : (
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h1>Please connect your wallet</h1>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CreateCollection;
