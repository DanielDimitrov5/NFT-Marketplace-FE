import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getItem, getOffers, acceptOffer as accept } from "../services/helpers";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { Image } from 'antd';

const ItemDashboard = () => {

    const { id } = useParams();
    const [data, setData] = useState();
    const [offers, setOffers] = useState();
    const [isAccepting, setIsAccepting] = useState({});

    const getData = async () => {
        const result = await getItem(id);

        const provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_INFURA_KEY);
        const offers = await getOffers(provider, id);

        setData(result);
        setOffers(offers);
    }

    const acceptOffer = async (offererAddress) => {
        setIsAccepting(prevState => ({
            ...prevState,
            [offererAddress]: true
        }));

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const result = await accept(signer, id, offererAddress);

            if (result === 1) {
                alert('Offer accepted successfully!');
            }

        } catch (error) {
            console.log(error);
            alert('Something went wrong!');
        }
        finally {
            setIsAccepting(prevState => ({
                ...prevState,
                [offererAddress]: false
            }));
            getData();
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="container">
            <div className="row">
                {data && (
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
                                                    <button onClick={() => acceptOffer(offer.offerer)} className="btn btn-primary" disabled={offer.isAccepted || isAccepting[offer.offerer]}>Accept</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>)}
                    </>
                )}
            </div>
        </div>
    );
}

export default ItemDashboard;