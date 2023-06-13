import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from "@fortawesome/free-brands-svg-icons"

const ItemCards = ({ contractData, isLoadingContractData }) => {
    return (
        <div className="container my-5">
            {isLoadingContractData ? (
                <div className="text-center">
                    <FontAwesomeIcon icon={faEthereum} spin size="2xl" />
                </div>
            ) : (
                <div className="row">
                    {contractData.items.map((item, i) => (
                        <div className="col-md-4" key={i}>
                            <div className="card mb-4">
                                <img
                                    src={contractData.metaData[i].image}
                                    className="card-img-top"
                                    alt="..."
                                    style={{ height: '300px', objectFit: 'cover' }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{contractData.metaData[i].name}</h5>
                                    <p className="card-text">{contractData.metaData[i].description}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="btn-group">
                                            <Link
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                                to={`/item/${item.id}`}
                                            >
                                                View
                                            </Link>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                            >
                                                Buy
                                            </button>
                                        </div>{
                                            item.price.toString() === '0' ? (
                                                <button type="button" className="btn btn-sm btn-outline-secondary">
                                                    Place offer
                                                </button>
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