import Loading from './Loading';
import ItemCard from './ItemCard';

const ItemCards = ({ contractData, isLoadingContractData }) => {

    return (
        <div className="container my-5">
            {isLoadingContractData ? (
                <Loading />
            ) : (
                <div className="row">
                    {contractData.items.map((item, i) => (
                        <ItemCard contractData={contractData.metaData[i]} item={item} i={i} key={i} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ItemCards;