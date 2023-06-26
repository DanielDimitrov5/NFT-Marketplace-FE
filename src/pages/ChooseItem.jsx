import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addItemToMarketplace, loadItemsForAdding } from "../services/helpers";
import { ethers } from "ethers";
import Button from "../components/ui/Button";
import Loading from "../components/Loading";
import { useAccount } from "wagmi";

const ChooseItem = () => {

    const { id: nftContractAddress } = useParams()
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const { address } = useAccount();

    const getData = async () => {
        setIsLoading(true);

        const provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_API_KEY);

        const nftsFiltered = await loadItemsForAdding(provider, nftContractAddress, address);

        setItems(nftsFiltered);
        setIsLoading(false);
    }

    const add = async (tokenId) => {
        setIsAdding({ [tokenId]: true });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const status = await addItemToMarketplace(signer, nftContractAddress, tokenId);

        if (status === 1) {
            const newItems = items.filter(item => item.tokenId !== tokenId);
            setItems(newItems);
        }

        setIsAdding({ [tokenId]: false });
    }

    useEffect(() => {
        getData();
    }, [address]);

    return (
        <>
            <br />
            <h1>Choose item</h1>
            {isLoading ? (
                <Loading />
            ) : (
                items.length === 0 ? <p>You don't have any items!</p>
                    : <div>
                        {items.map(item => (
                            <div className="card" key={item.tokenId}>
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text">{item.description}</p>
                                    <Button onClick={() => add(item.tokenId)} className="btn btn-primary" disabled={isAdding[item.tokenId]}>Add</Button>
                                </div>
                                <div className="card-footer">
                                    <small className="text-muted">Token ID: {item.tokenId}</small>
                                </div>
                            </div>
                        ))}
                    </div>
            )}
        </>

    )
}

export default ChooseItem;