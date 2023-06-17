import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadCollectionItems, loadItems, addItemToMarketplace } from "../services/helpers";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from "@fortawesome/free-brands-svg-icons"

const ChooseItem = () => {

    const { id: nftContractAddress } = useParams()
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getData = async () => {
        setIsLoading(true);

        const provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_API_KEY);

        const nfts = await loadCollectionItems(provider, nftContractAddress);

        const addedItems = await loadItems(provider);

        const ids = addedItems.metadataArrModified.filter(item => item.nft === nftContractAddress).map(item => item.tokenId);

        const itemsFiltered = nfts.filter(item => !ids.includes(item.tokenId));

        setItems(itemsFiltered);
        setIsLoading(false);
    }

    const add = async (tokenId) => {
        setIsLoading(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        await addItemToMarketplace(signer, nftContractAddress, tokenId);

        setIsLoading(false);
    }

    useEffect(() => {
        getData();
    }, []);

    //bootsrap item cards with add button

    return (
        <>
            <br />
            <h1>Choose item</h1>
            {isLoading ? (
                <div className="text-center">
                    <FontAwesomeIcon icon={faEthereum} spin size="2xl" />
                </div>
            ) : (
                items.length === 0 ? <p>This collection is empty.</p>
                    : <div>
                        {items.map(item => (
                            <div className="card" key={item.tokenId}>
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text">{item.description}</p>
                                    <Button onClick={() => add(item.tokenId)} className="btn btn-primary">Add</Button>
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