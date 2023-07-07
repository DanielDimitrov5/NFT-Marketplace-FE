import { useState } from "react";
import { successMessage } from "../services/alertMessages";
import { useSDK } from "../hooks/useSDK";

const AddItemCard = ({ item }) => {
    const sdk = useSDK();

    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const add = async () => {
        setIsAdding(true);

        const status = await sdk.addItemToMarketplace(item.nft, item.tokenId);

        if (status === 1) {
            successMessage("Item added to marketplace successfully!");
            setIsAdded(true);
        }

        setIsAdding(false);
    }

    if (isAdded) return null;

    return (
        <div className="card" key={item.tokenId}>
            <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.description}</p>
                {!isAdding ? (
                    <button onClick={add} className="btn btn-primary" disabled={isAdding}>Add</button>
                ) : (
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
            </div>
            <div className="card-footer">
                <small className="text-muted">Token ID: {item.tokenId}</small>
            </div>
        </div>
    )
}

export default AddItemCard;