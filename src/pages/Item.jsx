import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Link } from "react-router-dom"
import { getItem, buyItem, placeOffer as placeOfferHelper, getOffer } from "../services/helpers"
import { Image } from 'antd';
import Loading from "../components/Loading"
import { useAccount } from "wagmi"
import { InputNumber, Popover } from "antd"

const Item = () => {
    const [data, setData] = useState()
    const [isInteracting, setIsInteracting] = useState(false)
    const [inputValue, setInputValue] = useState(0)
    const [offer, setOffer] = useState();

    const { isConnected, address } = useAccount()

    const { id } = useParams()

    const getData = async () => {
        const result = await getItem(id);

        setData(result)

        getOfferById(result);
    }

    const buyItemById = async () => {
        setIsInteracting(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        if (signer && data) {

            const result = await buyItem(signer, data.item.id, data.item.price);

            if (result === 1) {
                alert('Transaction successful!');
                getData();
            }
        }
        else {
            alert('Please connect your wallet');
        }

        setIsInteracting(false);
    }

    const placeOffer = async () => {
        setIsInteracting(true);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        if (signer && data) {

            const price = ethers.utils.parseEther(inputValue.toString());

            const result = await placeOfferHelper(signer, data?.item?.id, price);

            if (result === 1) {
                alert('Offer placed successfully!');
                setOffer({ itemId: data?.item.id, price, isAccepted: false });
            }
        }
        else {
            alert('Please connect your wallet');
        }

        setIsInteracting(false);
    }
    const getOfferById = async (result) => {
        setIsInteracting(true);

        const provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_INFURA_KEY);

        const { itemId, price, isAccepted, seller } = await getOffer(provider, result?.item?.id, address);

        if (itemId.toString() !== "0" && seller === result?.item?.owner) {
            setOffer({ itemId, price, isAccepted });
        }

        setIsInteracting(false);
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
        getData();
    }, []);

    return (
        <div className="container">
            <br />
            {data ?
                <div className="row">
                    <div className="col-12 col-md-6">
                        <Image.PreviewGroup>
                            <Image width={550} src={data?.metadata?.data?.image} />
                        </Image.PreviewGroup>
                    </div>
                    <div className="col-12 col-md-6">
                        <br />
                        <h1>{data?.metadata?.data?.name}</h1>
                        <p>{data?.metadata?.data?.description}</p>
                        <p>Collection: <Link to={`/collections/${data?.item?.nftContract}`}>{data?.item?.nftContract}</Link></p>
                        <p>Owner: <Link to={`/user/${data?.item?.owner}`}>{data?.item?.owner}</Link></p>
                        {data?.item?.price.toString() !== "0" && <p>Price: {ethers.utils.formatEther(data?.item?.price.toString())}</p>}
                        {data?.item?.owner !== address &&
                            <>
                                {!isInteracting ? (
                                    <>
                                        {data && data?.item?.price.toString() !== '0' ? (
                                            isConnected && <button onClick={buyItemById} className="btn btn-primary">Buy</button>
                                        ) : (
                                            <Popover trigger={'click'} placement="bottom" content={content} title="Place offer">
                                                {isConnected && <button onClick={() => {
                                                    setInputValue(0);
                                                }} type="button" className="btn btn-primary">
                                                    Place offer
                                                </button>
                                                }
                                                {offer && (
                                                    <>
                                                        <span className="mx-3">|</span>
                                                        <small className="text-muted">Your current offer: {ethers.utils.formatEther(offer.price)} ETH</small>
                                                    </>
                                                )}
                                            </Popover>
                                        )}
                                    </>
                                ) : (
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                )}
                            </>
                        }
                    </div>
                </div> : (
                    <Loading />
                )
            }

        </div >
    )

}

export default Item