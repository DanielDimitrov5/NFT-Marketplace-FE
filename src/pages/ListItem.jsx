import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Loading from "../components/Loading";
import ListItemCard from "../components/ListItemCard";
import { useSDK } from "../hooks/useSDK";

const ListItem = () => {
    const sdk = useSDK();

    const [items, setItems] = useState([]);
    const { isConnected, address } = useAccount();
    const [isLoading, setIsLoading] = useState(true);

    const getData = async () => {
        setIsLoading(true);

        const { filteredItems, nfts } = await sdk.loadItemsForListing(address);

        setItems({ filteredItems, nfts });
        setIsLoading(false);
    }

    useEffect(() => {
        getData();
    }, [address]);

    return (
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
                            <h1 className="text-center">List Item</h1>
                            {isLoading ? (
                                <Loading />
                            ) : (
                                <>
                                    {items.filteredItems.length === 0 ? (
                                        <div className="text-center">
                                            <p>No items found</p>
                                        </div>
                                    ) : (
                                        <div className="row">
                                            {items.nfts.map((nft, i) => (
                                                <ListItemCard nft={nft} i={i} />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ListItem;