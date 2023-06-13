import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { erc721ABI } from "wagmi"
import axios from "axios"
import marketplaceABI from "../contractData/abi/NFTMarketplace.json"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from "@fortawesome/free-brands-svg-icons"

const marketplaceContract = {
    address: '0xa79Ef7898394B79b809043B9CDE8Dbc1f3550E02',
    abi: marketplaceABI,
}

const Item = () => {
    const [data, setData] = useState()

    const { id } = useParams()

    const getItem = async () => {
        const provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_API_KEY);
        const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, provider);

        const item = await contract.items(id)

        const nftContract = new ethers.Contract(item.nftContract, erc721ABI, provider);

        const tokenUri = (await nftContract.tokenURI(item.tokenId)).replace('ipfs://', process.env.REACT_APP_IPFS_PROVIDER);

        const metadata = await axios.get(tokenUri);

        metadata.data.image = metadata.data.image.replace('ipfs://', process.env.REACT_APP_IPFS_PROVIDER);

        setData({ item, metadata })
    }

    useEffect(() => {
        getItem()
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
                        <p>Owner: {data?.item?.owner}</p>
                        <p>Price: {ethers.utils.formatEther(data?.item?.price.toString())} <FontAwesomeIcon icon={faEthereum} /></p>
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