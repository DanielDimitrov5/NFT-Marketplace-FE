import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { mintNFT } from "../services/helpers";
import nftABI from "../contractData/abi/NFT.json";

const MintFrom = () => {

    const { id } = useParams();
    const { isConnected, address } = useAccount();
    const [isOwner, setIsOwner] = useState(false);
    const [isMinting, setIsMinting] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.includes("image")) {
            setImage(file);
        } else {
            alert("Please select a valid image file.");
            setImage("");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !description) {
            alert('Please enter name and description');
            return;
        }

        const data = {
            name,
            description,
            image
        }

        try {
            setIsMinting(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const result = await mintNFT(signer, id, data);

            if (result === 1) {
                alert('NFT minted successfully!');
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setIsMinting(false);
            setName('');
            setDescription('');
            setImage('');

            document.getElementById('image').value = '';
        }
    }

    const checkOwner = async () => {
        const provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_API_KEY);
        const contract = new ethers.Contract(id, nftABI, provider);

        try {
            const owner = await contract.owner();

            if (owner === address) {
                setIsOwner(true);
            }
            else {
                setIsOwner(false);
            }
        } catch (error) {
            setIsOwner(false);
        }
    }

    useEffect(() => {
        if (isConnected) {
            checkOwner();
        }
    }, [isConnected, address]);

    return (
        <>
            {isConnected && isOwner ? (
                <>
                    <br />
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <br />
                                <h1 className="text-center">Mint NFT</h1>
                                <div className="text-center">
                                    <p>{id}</p>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <input type="text" className="form-control" id="name" placeholder="Enter name" value={name} onChange={handleNameChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <textarea className="form-control" id="description" placeholder="Enter description" value={description} onChange={handleDescriptionChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="image">Image</label>
                                        <input type="file" className="form-control" id="image" placeholder="Upload image" onChange={handleImageChange} />
                                    </div>
                                    {isMinting ? (
                                        <button type="submit" className="btn btn-primary" disabled>Mint</button>
                                    ) : (
                                        <button type="submit" className="btn btn-primary">Mint</button>
                                    )
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <br />
                    <p>You are not allowed to mint from this collection!</p>
                </>
            )
            }
        </>
    )
}

export default MintFrom;