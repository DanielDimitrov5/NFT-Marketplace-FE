import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { useAccount } from "wagmi";
import AddItemCard from "../components/AddItemCard";

import { useSDK } from "../hooks/useSDK";

const ChooseItem = () => {
    const sdk = useSDK();

    const { id: nftContractAddress } = useParams()
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { address } = useAccount();

    const getData = async () => {
        setIsLoading(true);

        const nftsFiltered = await sdk.loadItemsForAdding(nftContractAddress, address);

        setItems(nftsFiltered);
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
                <Loading />
            ) : (
                items.length === 0 ? <p>You don't have any items!</p>
                    : <div>
                        {items.map(item => (
                            <AddItemCard item={item} />
                        ))}
                    </div>
            )}
        </>
    )
}

export default ChooseItem;