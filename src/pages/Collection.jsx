import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { loadItems } from "../services/helpers";
import ItemCards from "../components/ItemCards";
import Link from "antd/es/typography/Link";
import marketplaceABI from "../contractData/abi/NFTMarketplace.json";

const marketplaceContract = {
    address: '0xa79Ef7898394B79b809043B9CDE8Dbc1f3550E02',
    abi: marketplaceABI,
}

const Collection = () => {

    const { id } = useParams()

    const [contractData, setContractData] = useState({});
    const [isLoadingContractData, setIsLoadingContractData] = useState(true);

    const getItems = async () => {
        setIsLoadingContractData(true);
        const provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_API_KEY);
        const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, provider);

        const { items, metadataArrModified } = await loadItems(contract);

        //filter items by collection address and then metadataArrModified on the same index
        const itemsFiltered = items.filter(item => item.nftContract === id);
        const metadataArrModifiedFiltered = metadataArrModified.filter((item, index) => itemsFiltered.includes(items[index]));

        console.log("filter", itemsFiltered);
        console.log("filter1", metadataArrModifiedFiltered);

        setContractData({ ...contractData, items: itemsFiltered, metaData: metadataArrModifiedFiltered });
        setIsLoadingContractData(false);
    }

    useEffect(() => {
        getItems();
    }, []);

    if (!contractData.items) return null;

    return (
        <>
            <br />
            <h1>Collection: {id}</h1>
            {contractData.items.length === 0 && <p>This collection is empty. <Link href="/add-item">Add item</Link> from this collection if you own one.</p>}
            <ItemCards contractData={contractData} isLoadingContractData={isLoadingContractData} />
        </>
    )

}

export default Collection;