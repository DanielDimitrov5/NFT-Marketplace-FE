import { useState } from "react";
import { useAccount } from "wagmi";
import { ethers, ContractFactory } from "ethers";
import marketplaceABI from "../contractData/abi/NFTMarketplace.json";
import nftABI from "../contractData/abi/NFT.json";
import nftBytecode from "../contractData/NftBytecode.json";

const CreateCollection = () => {
    const { isConnected, address } = useAccount();

    const [collectionName, setCollectionName] = useState("");
    const [collectionSymbol, setCollectionSymbol] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const marketplaceContract = {
        address: '0xa79Ef7898394B79b809043B9CDE8Dbc1f3550E02',
        abi: marketplaceABI,
    }

    const deployNFTCollection = async () => {
        setIsLoading(true);

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const factory = new ContractFactory(nftABI, nftBytecode.bytecode, signer);
            const contract = await factory.deploy(collectionName, collectionSymbol);
            await contract.deployed();

            const marketplace = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, signer);
            const tx = await marketplace.addCollection(contract.address);
            await tx.wait();
        } catch (error) {
            console.error(error);
        }
        finally {
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
                                    <button type="submit" className="btn btn-primary" disabled>Create</button>) : (
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
