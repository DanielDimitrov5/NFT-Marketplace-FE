import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadCollectionItems, loadItems, addItemToMarketplace } from "../services/helpers";
import { ethers } from "ethers";
import Button from "../components/ui/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from "@fortawesome/free-brands-svg-icons"
import { useAccount, erc721ABI } from "wagmi";

const ChooseItem = () => {

    const { id: nftContractAddress } = useParams()
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { isConnected, address } = useAccount();

    const getData = async () => {
        setIsLoading(true);

        const provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_API_KEY);

        const { items } = await loadItems(provider);

        const ids = items.filter(item => item.nftContract === nftContractAddress).map(item => parseInt(item.tokenId));

        const nfts = await loadCollectionItems(provider, nftContractAddress);

        if (nfts.length === 0) {
            setIsLoading(false);
            setItems([]);
            return;
        }

        const itemsFilteredIds = nfts.filter(item => !ids.includes(item.tokenId)).map(item => parseInt(item.tokenId));

        const contract = new ethers.Contract(nftContractAddress, erc721ABI, provider);

        const nftsFiltered = [];

        for (let i = 0; i < itemsFilteredIds.length; i++) {
            const tokenId = itemsFilteredIds[i];
            const owner = await contract.ownerOf(tokenId);

            if (owner === address) {
                nftsFiltered.push(nfts.find(nft => parseInt(nft.tokenId) === tokenId));
            }
        }

        setItems(nftsFiltered);
        setIsLoading(false);
    }

    const add = async (tokenId) => {
        setIsLoading(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const status = await addItemToMarketplace(signer, nftContractAddress, tokenId);

        if (status === 1) {
            const newItems = items.filter(item => item.tokenId !== tokenId);
            setItems(newItems);
        }

        setIsLoading(false);
    }

    useEffect(() => {
        getData();
    }, [address]);

    return (
        <>
            <br />
            <h1>Choose item</h1>
            {isLoading ? (
                <div className="text-center">
                    <FontAwesomeIcon icon={faEthereum} spin size="2xl" />
                </div>
            ) : (
                items.length === 0 ? <p>You don't have any items!</p>
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