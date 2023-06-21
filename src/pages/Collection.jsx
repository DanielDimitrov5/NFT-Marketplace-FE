import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { loadItems, loadCollectionItems } from "../services/helpers";
import ItemCards from "../components/ItemCards";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from "@fortawesome/free-brands-svg-icons"
import Link from "antd/es/typography/Link";

const Collection = () => {

    const { id: nftContractAddress } = useParams()

    const [contractData, setContractData] = useState({});
    const [isLoadingContractData, setIsLoadingContractData] = useState(true);

    const getItems = async () => {
        setIsLoadingContractData(true);
        const provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_API_KEY);

        const { items, metadataArrModified } = await loadItems(provider);

        const itemsFiltered = items.filter(item => item.nftContract === nftContractAddress);
        const metadataArrModifiedFiltered = metadataArrModified.filter((item, index) => itemsFiltered.includes(items[index]));

        setContractData({ ...contractData, items: itemsFiltered, metaData: metadataArrModifiedFiltered });
        setIsLoadingContractData(false);
    }

    useEffect(() => {
        getItems();
    }, []);

    return (
        <>
            <br />
            <h1>Collection: {nftContractAddress}</h1>
            <h2>All added items</h2>
            {isLoadingContractData ? (
                <div className="text-center">
                    <FontAwesomeIcon icon={faEthereum} spin size="2xl" />
                </div>
            ) : (
                contractData.items.length === 0 ? <p>We don't have any items from this collection. <Link href={`/add-item-from/${nftContractAddress}`}>Add item</Link> from this collection if you own one.</p>
                    : <ItemCards contractData={contractData} isLoadingContractData={isLoadingContractData} />)
            }
        </>
    )

}

export default Collection;