import { Link } from "react-router-dom";

const CollectionCard = ({ collection, index }) => {

    return (
        <div className="col-12 col-md-6 col-lg-4" key={index}>
            <div className="card" style={{ marginBottom: '20px' }}>
                <Link to={`${collection.address}`}>
                    <div className="card-body">
                        <h5 className="card-title">{collection.name}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{collection.symbol}</h6>
                        <h6 className="card-subtitle mb-2 text-muted">{collection.address}</h6>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default CollectionCard;