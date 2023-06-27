import { useState } from "react";
import { ethers } from "ethers";
import { isAddress } from "ethers/lib/utils.js";
import { addExistingCollection } from "../services/helpers";
import { useAccount } from "wagmi";

const AddExistingCollection = () => {
    const [collectionAddress, setCollectionAddress] = useState("");
    const [isValidAddress, setIsValidAddress] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { isConnected } = useAccount();

    const handleAddressChange = (e) => {
        const address = e.target.value;
        setCollectionAddress(address);
        setIsValidAddress(isAddress(address));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isAddress(collectionAddress)) {
            setIsSubmitting(true);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const result = await addExistingCollection(signer, collectionAddress);

            if (result === 1) {
                alert("Successfully added collection");
            }

            setIsSubmitting(false);
        }

        setCollectionAddress("");
        setIsSubmitting(false);
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        {!isConnected ? (
                            <div className="col-12">
                                <br />
                                <h1>Please connect your wallet</h1>
                            </div>
                        ) : (
                            <>
                                <br />
                                <h1 className="text-center">Add Existing Collection</h1>
                                <div className="text-center">
                                    <p>Enter the address of the collection you want to add</p>
                                </div>
                                {!isSubmitting ? (
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="collectionName" className="form-label">
                                                NFT Collection address
                                            </label>
                                            <input
                                                onChange={handleAddressChange}
                                                type="text"
                                                className={`form-control ${isValidAddress ? "" : "is-invalid"}`}
                                                id="collectionName"
                                            />
                                            {!isValidAddress && (
                                                <div className="invalid-feedback">Invalid address</div>
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={!isValidAddress}
                                            >
                                                Add
                                            </button>

                                        </div>
                                    </form>
                                ) : (
                                    <div className="text-center">
                                        <p>Adding collection...</p>
                                    </div>
                                )}

                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddExistingCollection;
