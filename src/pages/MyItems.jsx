import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { useSDK } from "../hooks/useSDK";

const MyItems = () => {
    const sdk = useSDK();

    const { isConnected, address } = useAccount();
    const [contractData, setContractData] = useState({});
    const [isLoadingContractData, setIsLoadingContractData] = useState(true);

    const load = async () => {
        setIsLoadingContractData(true);
        const { items, metadataArrModified } = await sdk.loadItems();

        const filteredItems = items.filter(item => item.owner === address);
        const filteredMetadata = metadataArrModified.filter(item => item.owner === address);

        setContractData({ ...contractData, items: filteredItems, metaData: filteredMetadata });
        setIsLoadingContractData(false);
    }

    useEffect(() => {
        load();
    }, [address]);

    return (
        <div className="container">
            <br />
            {isConnected ? (
                <>
                    <div className="row">
                        <div className="col-12">
                            <h1>My Items</h1>
                        </div>
                    </div>
                    {isLoadingContractData ? (
                        <Loading />
                    ) : (
                        <div className="row">
                            <div className="col-12">
                                <div className="row">
                                    {contractData.items && contractData.items.map((item, index) => {
                                        return (
                                            <div className="col-3" key={index}>
                                                <div className="card">
                                                    <img src={contractData.metaData[index].image} className="card-img-top" alt="..." />
                                                    <div className="card-body">
                                                        <h5 className="card-title">{contractData.metaData[index].name}</h5>
                                                        <p className="card-text">{contractData.metaData[index].description.slice(0, 200)}...</p>
                                                        <Link to={`${item.id}`} className="btn btn-primary">View details</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    )}
                                </div>
                            </div>
                        </div>)}
                </>
            ) : (
                <div className="row">
                    <div className="col-12">
                        <h1>Please connect your wallet</h1>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyItems;
