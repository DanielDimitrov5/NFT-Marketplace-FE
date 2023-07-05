import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Loading from "../components/Loading";
import { useSDK } from "../hooks/useSDK";
import MyOffereCard from "../components/MyOffersCard";

const MyOfferes = () => {
    const sdk = useSDK();

    const { isConnected, address } = useAccount();

    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const getData = async () => {
        setIsLoading(true);
        const result = await sdk.getAccountsOffers(address);

        setData(result);
        setIsLoading(false);
    }

    useEffect(() => {
        getData();
    }, [address]);

    return (
        <div className="container">
            <br />
            {isConnected ? (
                <>
                    {isLoading ? (
                        <>
                            <Loading />
                        </>
                    ) : (
                        <>
                            {data && data.length == 0 ? (
                                <>
                                    <h1>You haven't made any offers yet</h1>
                                </>
                            ) : (
                                <>
                                    <div className="row">
                                        <div className="col-12">
                                            <br />
                                            <h1>My Offers</h1>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Item ID</th>
                                                        <th scope="col">Price</th>
                                                        <th scope="col">Status</th>
                                                        <th scope="col">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data && data.map((item, index) => {
                                                        return (
                                                            <MyOffereCard item={item} index={index} />
                                                        )
                                                    }
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>)}
                        </>
                    )}
                </>
            ) : (
                <div className="row">
                    <div className="col-12">
                        <h1>Please connect your wallet</h1>
                    </div>
                </div>
            )}
        </div >
    )
}

export default MyOfferes;