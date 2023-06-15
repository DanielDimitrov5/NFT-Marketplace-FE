import { ethers } from "ethers";
import { erc721ABI } from "wagmi";
import axios from "axios";

const loadItems = async (contract) => {
    try {
        const count = await contract.itemCount();

        const countArr = Array.from({ length: count.toNumber() }, (_, i) => i + 1);

        const itemsPromises = countArr.map((item) => contract.items(item));

        const items = await Promise.all(itemsPromises);

        const URIPrimises = items.map((item) => {
            const nftContract = new ethers.Contract(
                item.nftContract,
                erc721ABI,
                contract.provider,
            );
            const tokenUri = nftContract.tokenURI(item.tokenId);
            return tokenUri;
        });


        const URIs = await Promise.all(URIPrimises);

        const URIsModified = URIs.map((uri) => {
            return uri.replace('ipfs://', process.env.REACT_APP_IPFS_PROVIDER);
        });

        const metadataPromises = URIsModified.map((uri) => {
            return axios.get(uri);
        });

        const metadataArr = await Promise.all(metadataPromises);

        const metadataArrModified = metadataArr.map((metadata) => {
            return {
                ...metadata,
                name: metadata.data.name,
                image: metadata.data.image.replace('ipfs://', process.env.REACT_APP_IPFS_PROVIDER),
                description: metadata.data.description,
            };
        });

        return { items, metadataArrModified };
    } catch (error) {
        console.log(error);
    }
}

export { loadItems };

const loadCollections = async (contract) => {
    try {
        const count = await contract.collectionCount();
        const countArr = Array.from({ length: count.toNumber() }, (_, i) => i + 1);
        const collectionsPromises = countArr.map((collection) => contract.collections(collection));

        const collections = await Promise.all(collectionsPromises);

        const collectionContractPromises = collections.map((collection) => {
            const collectionContract = new ethers.Contract(
                collection,
                erc721ABI,
                contract.provider,
            );

            return [collectionContract.name(), collectionContract.symbol(), collectionContract.address];
        });

        const resolvedCollections = await Promise.all(
            collectionContractPromises.map(async (collectionPromises) => {
                const [namePromise, symbolPromise, addressPromise] = collectionPromises;
                const [name, symbol, address] = await Promise.all([namePromise, symbolPromise, addressPromise]);
                return { name, symbol, address };
            })
        );

        return resolvedCollections;

    } catch (err) {
        console.log(err);
    }
}

export { loadCollections };

