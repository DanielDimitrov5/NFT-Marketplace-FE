import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Loading from './Loading';
import { buyItem, placeOffer as placeOfferHelper } from '../services/helpers';
import { Popover, InputNumber } from 'antd';
import { Link } from 'react-router-dom';

const ItemCards = ({ contractData, isLoadingContractData }) => {

    const [signer, setSigner] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState(0);
    const [itemProperties, setItemProperties] = useState({});

    const buyItemById = async (id, price) => {
        setIsLoading(true);

        if (signer) {
            const result = await buyItem(signer, id, price);

            if (result === 1) {
                alert('Transaction successful!');
            }
        }
        else {
            alert('Please connect your wallet');
        }

        setIsLoading(false);
    }

    const palaceOffer = async () => {
        setIsLoading(true);

        if (signer) {

            const itemId = itemProperties.itemId;
            const price = ethers.utils.parseEther(inputValue.toString());

            const result = await placeOfferHelper(signer, itemId, price);

            if (result === 1) {
                alert('Offer placed successfully!');
            }
        }
        else {
            alert('Please connect your wallet');
        }
    }

    useEffect(() => {
        if (contractData) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                setSigner(signer);
            }
            catch (err) {
                console.log(err);
            }
        }
    }, [contractData]);

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
                <button type="button" className="btn btn-primary" onClick={() => palaceOffer()}>Place offer</button>
            ) : (
                <button type="button" className="btn btn-primary" disabled>Place offer</button>
            )}
        </div>
    );

    return (
        <div className="container my-5">
            {isLoadingContractData ? (
                <Loading />
            ) : (
                <div className="row">
                    {contractData.items.map((item, i) => (

                        <div className="col-md-4" key={i}>
                            <div className="card mb-4">
                                <Link to={`/item/${item.id}`}>
                                    <img
                                        src={contractData.metaData[i].image}
                                        className="card-img-top"
                                        alt="..."
                                        style={{ height: '300px', objectFit: 'cover' }}
                                    />
                                </Link>
                                <div className="card-body">
                                    <h5 className="card-title">{contractData.metaData[i].name}</h5>
                                    <p className="card-text">{contractData.metaData[i].description.slice(0, 200)}...</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        {item.price.toString() !== '0' && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => buyItemById(item.id, item.price)}
                                            >
                                                Buy
                                            </button>)}
                                        {
                                            item.price.toString() === '0' ? (
                                                <Popover trigger={'click'} placement="bottom" content={content} title="Place offer">
                                                    <button onClick={() => {
                                                        setItemProperties({
                                                            itemId: item.id
                                                        });
                                                        setInputValue(0);
                                                    }} type="button" className="btn btn-sm btn-outline-secondary">
                                                        Place offer
                                                    </button>
                                                </Popover>
                                            ) : (
                                                <small className="text-muted">{ethers.utils.formatEther(item.price)} ETH</small>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ItemCards;