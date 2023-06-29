import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { loadItemsForListing, listItemForSale } from "../services/helpers";
import { Popover, InputNumber } from 'antd';
import Loading from "../components/Loading";
import { successMessage, errorMessage } from "../services/alertMessages";

const ListItem = () => {

    const [items, setItems] = useState([]);
    const { isConnected, address } = useAccount();
    const [isLoading, setIsLoading] = useState(true);
    const [inputValue, setInputValue] = useState(0);
    const [itemProperties, setItemProperties] = useState({});
    const [isListing, setIsListing] = useState({});

    const getData = async () => {
        setIsLoading(true);
        const provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_API_KEY);

        const { filteredItems, nfts } = await loadItemsForListing(provider, address);

        setItems({ filteredItems, nfts });
        setIsLoading(false);
    }

    const setProperties = (nft, tokenId) => {
        setItemProperties({ nft, tokenId });
    }

    const list = async () => {
        setIsListing({ [itemProperties.tokenId + itemProperties.nft]: true })
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        try {
            const result = await listItemForSale(signer, itemProperties.nft, itemProperties.tokenId, ethers.utils.parseEther(inputValue.toString()));

            if (result === 1) {
                setItems({ filteredItems: items.filteredItems.filter(item => item.tokenId !== itemProperties.tokenId), nfts: items.nfts.filter(nft => nft.tokenId !== itemProperties.tokenId) });
                successMessage('Item listed successfully!');
            }
        } catch (error) {
            errorMessage('Something went wrong!');
            console.log(error);
        }
        finally {
            setIsListing({ [itemProperties.tokenId + itemProperties.nft]: false })
            setInputValue(0);
        }
    }

    const content = (
        <div className="d-flex flex-column">
            <div className="form-group">
                <InputNumber
                    step={0.1}
                    addonBefore="+"
                    addonAfter="ETH"
                    defaultValue={0}
                    min={0}
                    onChange={setInputValue}
                />
            </div>
            {inputValue > 0 ? (
                <button type="button" className="btn btn-primary" disabled={isListing[itemProperties.tokenId + itemProperties.nft]} onClick={() => list()}>List</button>
            ) : (
                <button type="button" className="btn btn-primary" disabled>List</button>
            )}
        </div>
    );

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
                                                <div className="col-12 col-md-6 col-lg-4" key={i}>
                                                    <div className="card mb-3">
                                                        <img src={nft.image} className="card-img-top" alt={nft.name} />
                                                        <div className="card-body">
                                                            <h5 className="card-title">{nft.name}</h5>
                                                            <p className="card-text">{nft.description}</p>
                                                            <p className="card-text"><small className="text-muted">{nft.nft}</small></p>
                                                            <Popover trigger={'click'} placement="bottom" content={content} title="Set price">
                                                                {!isListing[nft.tokenId + nft.nft] ? (
                                                                    <button onClick={() => {
                                                                        setInputValue(0);
                                                                        setProperties(nft.nft, nft.tokenId);
                                                                    }} className="btn btn-primary">List</button>
                                                                ) : (
                                                                    <div className="spinner-border text-primary" role="status">
                                                                        <span className="visually-hidden">Loading...</span>
                                                                    </div>
                                                                )}
                                                            </Popover>
                                                        </div>
                                                    </div>
                                                </div>
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