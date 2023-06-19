import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { erc721ABI } from "wagmi"
import axios from "axios"
import marketplaceABI from "../contractData/abi/NFTMarketplace.json"
import { Link } from "react-router-dom"
import { getItem } from "../services/helpers"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from "@fortawesome/free-brands-svg-icons";

const Item = () => {
    const [data, setData] = useState()

    const { id } = useParams()

    const getData = async () => {
        const result = await getItem(id);

        setData(result)
    }

    useEffect(() => {
        getData()
    }, []);

    return (
        <div className="container">
            {data ?
                <div className="row">
                    <div className="col-12 col-md-6">
                        <img src={data?.metadata?.data?.image} alt={data?.metadata?.data?.name} style={{ height: '600px', objectFit: 'cover' }} />
                    </div>
                    <div className="col-12 col-md-6">
                        <br />
                        <h1>{data?.metadata?.data?.name}</h1>
                        <p>{data?.metadata?.data?.description}</p>
                        <p>Collection: <Link to={`/collections/${data?.item?.nftContract}`}>{data?.item?.nftContract}</Link></p>
                        <p>Owner: {data?.item?.owner}</p>
                        <p>Price: {ethers.utils.formatEther(data?.item?.price.toString())}</p>
                    </div>
                </div> : (
                    <div className="text-center">
                        <br />
                        <FontAwesomeIcon icon={faEthereum} spin size="2xl" />
                    </div>
                )
            }
        </div >
    )

}

export default Item