import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getAccountsOffers, claimItem } from "../services/helpers";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { successMessage, errorMessage } from "../services/alertMessages";

const MyOfferes = () => {
    const { address } = useAccount();

    const [data, setData] = useState();
    const [isClaiming, setIsClaiming] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const getData = async () => {
        setIsLoading(true);
        const provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_INFURA_KEY);
        const result = await getAccountsOffers(provider, address);

        setData(result);
        setIsLoading(false);
    }

    const claim = async (itemId, price) => {
        setIsClaiming({ ...isClaiming, [itemId]: true });
        const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();

        const result = await claimItem(signer, itemId, price);

        if (result) {
            successMessage("Item claimed successfully!");
            setData(data.filter(item => item.itemId != itemId));
        }
        else {
            errorMessage("Something went wrong!");
        }

        setIsClaiming({ ...isClaiming, [itemId]: false });
    }

    useEffect(() => {
        getData();
    }, [address]);

    return (
        <div className="container">
            {data && data.length == 0 ? (
                <>
                    <br />
                    <h1>You haven't made any offers yet</h1>
                </>
            ) : (
                <>
                    <div className="row">
                        <div className="col-12">
                            <br />
                            <h1>My Offers</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Item ID</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data && data.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td><Link to={`/item/${item.itemId}`}><b>{item.itemId.toNumber()}</b></Link></td>
                                                <td>{ethers.utils.formatEther(item.price)} ETH</td>
                                                <td>{item.isAccepted ? "Accepted" : "Pending"}</td>
                                                <td>
                                                    {!isClaiming[item.itemId] ? (

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
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>)}
        </div >
    )
}

export default MyOfferes;