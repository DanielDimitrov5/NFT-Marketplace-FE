import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { marketplaceContract } from "../services/helpers";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import { Image } from 'antd';
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import { successMessage, errorMessage } from "../services/alertMessages";
import { useSDK } from "../hooks/useSDK";

const ItemDashboard = () => {
    const sdk = useSDK();

    const { address } = useAccount();

    const { id } = useParams();
    const [data, setData] = useState();
    const [offers, setOffers] = useState();
    const [isAccepting, setIsAccepting] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isApproved, setIsApproved] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [isNotFound, setIsNotFound] = useState(false);


    const getData = async () => {
        setIsLoading(true);

        const result = await sdk.getItem(id);

        if (!result) {
            setIsNotFound(true);
        }

        const offers = (await sdk.getOffers(id)).filter(offer => offer.seller === address);

        const isApprovedResult = (await sdk.checkApproval(result.item.nftContract, result.item.tokenId)) === marketplaceContract.address;

        setIsApproved(isApprovedResult);

        setData(result);
        setOffers(offers);

        setIsLoading(false);
    }

    const acceptOffer = async (offererAddress) => {
        setIsAccepting(prevState => ({
            ...prevState,
            [offererAddress]: true
        }));

        setIsApproving(true);

        try {
            const result = await sdk.acceptOffer(id, offererAddress);

            if (result === 1) {
                successMessage('Offer accepted successfully!');
            }

        } catch (error) {
            console.log(error);
            errorMessage('Something went wrong!');
        }
        finally {
            setIsAccepting(prevState => ({
                ...prevState,
                [offererAddress]: false
            }));
            setIsApproving(false);
            getData();
        }
    }

    const approveHandler = async () => {
        try {
            setIsApproving(true);

            const result = await sdk.approveToken(data.item.nftContract, data.item.tokenId);

            if (result === 1) {
                successMessage('Token approved successfully!');
                setIsApproved(true);
            }

        } catch (error) {
            console.log(error);
            errorMessage('Something went wrong!');
        }
        finally {
            setIsApproving(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    if (isNotFound) return <NotFound message="Item with this ID does not exist!" />

    if (data?.item?.owner !== address && !isLoading) {
        return (
            <>
                <br />
                <h1>You are not the owner of this item!</h1>
                <Link to="/my-items">Back to your items</Link>
            </>
        )
    }

    return (
        <div className="container">
            <br />
            <div className="row">
                {data && !isLoading ? (
                    <>
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
                            <p>Owner: {data?.item?.owner}</p>
                            {data.item.price.toString() !== '0' && <p>Price: {ethers.utils.formatEther(data?.item?.price.toString())}</p>}
                            {isApproving ? (
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                <>
                                    {!isApproved && (<button onClick={approveHandler} className="btn btn-primary">Approve</button>)}
                                </>
                            )}
                        </div>
                        <hr />
                        {offers && offers.length > 0 && data.item.price.toString() === '0' && (
                            <div className="col-12 col-md-6">
                                <h1>Offers</h1>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Offerer</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {offers.sort(o => o.isAccepted).map((offer, index) => (
                                            <tr key={index}>
                                                <td>{offer.offerer}</td>
                                                <td>{ethers.utils.formatEther(offer.price.toString())} ETH</td>
                                                <td>{offer.isAccepted ? 'Accepted' : 'Pending'}</td>
                                                <td>
                                                    {isAccepting[offer.offerer] ? (
                                                        <div className="spinner-border text-primary" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => acceptOffer(offer.offerer)} className="btn btn-primary" disabled={offer.isAccepted}>Accept</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>)}
                    </>
                ) : (
                    <Loading />
                )}
            </div>
        </div>
    );
}

export default ItemDashboard;