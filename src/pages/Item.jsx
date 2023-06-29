import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Link } from "react-router-dom"
import { getItem } from "../services/helpers"
import { Image } from 'antd';
import Loading from "../components/Loading"

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
                        <p>Owner: {data?.item?.owner}</p>
                        {data?.item?.price.toString() !== '0' &&
                            <p>Price: {ethers.utils.formatEther(data?.item?.price.toString())}</p>
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