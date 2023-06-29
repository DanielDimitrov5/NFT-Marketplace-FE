import { useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { deployNFTCollection as deploy, addExistingCollection } from "../services/helpers";
import { successMessage, errorMessage } from "../services/alertMessages";

const CreateCollection = () => {
    const { isConnected } = useAccount();

    const [collectionName, setCollectionName] = useState("");
    const [collectionSymbol, setCollectionSymbol] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const deployNFTCollection = async () => {
        setIsLoading(true);

        try {

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const nft = await deploy(signer, collectionName, collectionSymbol);

            await addExistingCollection(signer, nft.address);

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
                            <h1>Create NFT collection</h1>
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
                            <h1>Connect your wallet</h1>
                            <br />
                            <p>Connect your wallet to create a collection</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CreateCollection;
