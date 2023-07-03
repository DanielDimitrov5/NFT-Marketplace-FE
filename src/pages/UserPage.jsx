import { useState, useEffect } from "react";
import ItemCards from "../components/ItemCards";
import { isAddress } from "ethers/lib/utils.js";
import { useSDK } from "../hooks/useSDK";

import { useParams } from "react-router-dom";

const UserPage = () => {
    const sdk = useSDK();

    const { id: walletAddress } = useParams();

    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const getData = async () => {
        setIsLoading(true);

        const { items, metadataArrModified } = (await sdk.loadItems());

        const itemsOwnedByUser = items.filter(item => item.owner === walletAddress);

        const metadataByUser = metadataArrModified.filter(metadata => {
            const { tokenId, nft } = metadata;
            const item = itemsOwnedByUser.find(item => item.tokenId === tokenId && item.nftContract === nft);
            return item;
        });

        setData({ ...data, items: itemsOwnedByUser, metaData: metadataByUser });

        setIsLoading(false);
    }

    useEffect(() => {
        getData();
    }, [walletAddress]);

    if (!isAddress(walletAddress)) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <br />
                        <h1>Invalid wallet address</h1>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <br />
                    <h1>Items owned by {walletAddress}</h1>
                </div>
            </div>
            <div className="row">
                {data && data.items.length === 0 ? (
                    <div className="col-12">
                        <br />
                        <h1>No items found</h1>
                    </div>
                ) : (
                    <ItemCards contractData={data} isLoadingContractData={isLoading} />
                )}
            </div>
        </div>
    )
}

export default UserPage;