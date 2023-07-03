import { useState } from "react";
import { ethers } from "ethers";
import { successMessage, errorMessage } from "../services/alertMessages.js";
import { useSDK } from "../hooks/useSDK";
import { InputNumber, Popover } from "antd";


const ListItemCard = ({ nft, i }) => {
    const sdk = useSDK();

    const [inputValue, setInputValue] = useState(0);
    const [itemProperties, setItemProperties] = useState({});
    const [isListing, setIsListing] = useState(false);
    const [isListed, setIsListed] = useState(false);

    const setProperties = (nft, tokenId) => {
        setItemProperties({ nft, tokenId });
    }

    const list = async () => {
        setIsListing(true)

        try {
            const result = await sdk.listItemForSale(itemProperties.nft, itemProperties.tokenId, ethers.utils.parseEther(inputValue.toString()));

            if (result === 1) {
                successMessage('Item listed successfully!');
                setIsListed(true);
            }
        } catch (error) {
            errorMessage('Something went wrong!');
            console.log(error);
        }
        finally {
            setIsListing(false)
            setInputValue(0);
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
                <button type="button" className="btn btn-primary" disabled={isListing[itemProperties.tokenId + itemProperties.nft]} onClick={() => list()}>List</button>
            ) : (
                <button type="button" className="btn btn-primary" disabled>List</button>
            )}
        </div>
    );

    if (isListed) return null;

    return (
        <div className="col-12 col-md-6 col-lg-4" key={i}>
            <div className="card mb-3">
                <img src={nft.image} className="card-img-top" alt={nft.name} />
                <div className="card-body">
                    <h5 className="card-title">{nft.name}</h5>
                    <p className="card-text">{nft.description}</p>
                    <p className="card-text"><small className="text-muted">{nft.nft}</small></p>
                    <Popover trigger={'click'} placement="bottom" content={content} title="Set price">
                        {!isListing ? (
                            <button onClick={() => {
                                setInputValue(0);
                                setProperties(nft.nft, nft.tokenId);
                            }} className="btn btn-primary">List</button>
                        ) : (
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        )}
                    </Popover>
                </div>
            </div>
        </div>
    )
}

export default ListItemCard;