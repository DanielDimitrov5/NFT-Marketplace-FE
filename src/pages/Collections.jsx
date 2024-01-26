import { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import CollectionCard from '../components/CollectionCard';
import { errorMessage } from '../services/alertMessages';
import { useSDK } from '../hooks/useSDK';

const Collections = () => {
  const sdk = useSDK();

  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCollectionsData = async () => {
    setIsLoading(true);

    try {
      const resolvedCollections = await sdk.loadCollections();

      setCollections(resolvedCollections);
    } catch (err) {
      errorMessage('Something went wrong!');
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCollectionsData();
  }, []);

  return (
    <div className="container">
      <br />
      <div className="row">
        <div className="col-12">
          <h1>Collections</h1>
        </div>
      </div>
      <div className="row">
        {isLoading ? (
          <Loading />
        ) : (
          collections.map((collection, index) => (
            <CollectionCard collection={collection} index={index} />
          ))
        )}
      </div>
    </div>
  );
};

export default Collections;
