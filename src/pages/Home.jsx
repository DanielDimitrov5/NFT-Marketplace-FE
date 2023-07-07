import { useState, useEffect } from 'react';
import ItemCards from '../components/ItemCards';
import { useAccount } from 'wagmi';

import { useSDK } from '../hooks/useSDK';

function Home() {

    const [contractData, setContractData] = useState({});
    const [isLoadingContractData, setIsLoadingContractData] = useState(true);
    const { address } = useAccount();

    const sdk = useSDK();

    const getContractData = async () => {
        setIsLoadingContractData(true);

        const { items, metadataArrModified } = await sdk.loadItems();

        const filteredItems = items.filter(item => item.owner !== address);
        const filteredMetadata = metadataArrModified.filter(item => item.owner !== address);

        setContractData({ ...contractData, items: filteredItems, metaData: filteredMetadata });
        setIsLoadingContractData(false);
    };

    useEffect(() => {
        getContractData();
    }, [address]);

    return <ItemCards contractData={contractData} isLoadingContractData={isLoadingContractData} />;
}

export default Home;
