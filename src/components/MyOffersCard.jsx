import { useState } from "react"
import { ethers } from "ethers"
import { Link } from "react-router-dom"
import { successMessage, errorMessage } from "../services/alertMessages"
import { useSDK } from "../hooks/useSDK"
import { useAccount, useBalance } from "wagmi"

const MyOffereCard = ({ item, index }) => {
    const sdk = useSDK();

    const { address } = useAccount();
    const { data: balance } = useBalance({
        address,
    });

    const [isClaiming, setIsClaiming] = useState(false);
    const [isClaimed, setIsClaimed] = useState(false);


    const claim = async (itemId, price) => {
        setIsClaiming(true);

        if (balance.value.lt(price)) {
            errorMessage("Insufficient funds!");
            setIsClaiming(false);
            return;
        }

        const result = await sdk.claimItem(itemId, price);

        if (result == 1) {
            successMessage("Item claimed successfully!");
            setIsClaimed(true);
        }
        else {
            errorMessage("Something went wrong!");
        }

        setIsClaiming(false);
    }

    if (isClaimed) return null;

    return (
        <tr key={index}>
            <td><Link to={`/item/${item.itemId}`}><b>{item.itemId.toNumber()}</b></Link></td>
            <td>{ethers.utils.formatEther(item.price)} ETH</td>
            <td>{item.isAccepted ? "Accepted" : "Pending"}</td>
            <td>
                {!isClaiming ? (

                    <button onClick={() => claim(item.itemId, item.price)} className="btn btn-primary" disabled={!item.isAccepted}>Claim</button>
                ) : (
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
            </td>
        </tr>
    )
}

export default MyOffereCard;