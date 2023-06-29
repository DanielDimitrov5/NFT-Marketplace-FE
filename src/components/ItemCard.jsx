import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { buyItem, placeOffer as placeOfferHelper, getOffer } from "../services/helpers";
import { Popover, InputNumber } from 'antd';
import { useAccount } from "wagmi";
import { successMessage, errorMessage } from "../services/alertMessages";

const ItemCard = ({ contractData, item, i }) => {

    const [signer, setSigner] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState(0);
    const [isVisable, setIsVisable] = useState(true);
    const [offer, setOffer] = useState();

    const { isConnected, address } = useAccount();

    const buyItemById = async () => {
        setIsLoading(true);

        if (signer) {

            const result = await buyItem(signer, item.id, item.price);

            if (result === 1) {
                successMessage('Item bought successfully!');

                setIsVisable(false);
            }
        }
        else {
            errorMessage('Please connect your wallet');
        }

        setIsLoading(false);
    }

    const placeOffer = async () => {
        setIsLoading(true);

        if (signer) {

            const price = ethers.utils.parseEther(inputValue.toString());

            const result = await placeOfferHelper(signer, item.id, price);

            if (result === 1) {
                successMessage('Offer placed successfully!');
                setOffer({ itemId: item.id, price, isAccepted: false });
            }
        }
        else {
            errorMessage('Please connect your wallet');
        }

        setIsLoading(false);
    }

    const getOfferById = async () => {
        const provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_INFURA_KEY);
        const { itemId, price, isAccepted, seller } = await getOffer(provider, item.id, address);

        if (itemId.toString() !== "0" && seller === item.owner) {
            setOffer({ itemId, price, isAccepted });
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
                <button type="button" className="btn btn-primary" onClick={() => placeOffer()}>Place offer</button>
            ) : (
                <button type="button" className="btn btn-primary" disabled>Place offer</button>
            )}
        </div>
    );


    useEffect(() => {
        if (isConnected) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                setSigner(signer);

                getOfferById();
            }
            catch (err) {
                errorMessage('Something went wrong!')
                console.log(err);
            }
        }
    }, [isConnected, address]);

    if (!isVisable) {
        return null;
    }

    return (
        <div className="col-md-4" key={i}>
            <div className="card mb-4">
                <Link to={`/item/${item.id}`}>
                    <img
                        src={contractData.image}
                        className="card-img-top"
                        alt="..."
                        style={{ height: '300px', objectFit: 'cover' }}
                    />
                </Link>
                <div className="card-body">
                    <h5 className="card-title">{contractData.name}</h5>
                    <p className="card-text">{contractData.description.slice(0, 200)}...</p>
                    <div className="d-flex justify-content-between align-items-center">
                        {item.owner !== address && (
                            <>
                                {!isLoading ? (
                                    <>
                                        {item.price.toString() !== '0' && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={buyItemById}
                                            >
                                                Buy
                                            </button>)}
                                        {
                                            item.price.toString() === '0' ? (
                                                <Popover trigger={'click'} placement="bottom" content={content} title="Place offer">
                                                    <button onClick={() => {
                                                        setInputValue(0);
                                                    }} type="button" className="btn btn-sm btn-outline-secondary">
                                                        Place offer
                                                    </button>

                                                    {offer && (
                                                        <>
                                                            <span className="mx-3">|</span>
                                                            <small className="text-muted">Your current offer: {ethers.utils.formatEther(offer.price)} ETH</small>
                                                        </>
                                                    )}
                                                </Popover>
                                            ) : (
                                                <small className="text-muted">{ethers.utils.formatEther(item.price)} ETH</small>
                                            )}
                                    </>

                                ) : (
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                )}
                            </>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemCard;