import { BigNumber, ethers } from "ethers";
import { erc721ABI } from "wagmi";
import axios from "axios";
import marketplaceABI from '../contractData/abi/NFTMarketplace.json';

const marketplaceContract = {
    address: '0x283986BAd88488eFa031AD6734926401c5Cfe127',
    abi: marketplaceABI,
}

const regex = new RegExp(`^ipfs:\/\/|^ipfs;\/\/`);


const loadItems = async (provider) => {
    try {
        const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, provider);

        const count = await contract.itemCount();

        const countArr = Array.from({ length: count.toNumber() }, (_, i) => i + 1);

        const itemsPromises = countArr.map((item) => contract.items(item));

        const items = await Promise.all(itemsPromises);

        const URIPromises = items.map((item) => {
            const nftContract = new ethers.Contract(
                item.nftContract,
                erc721ABI,
                contract.provider,
            );
            const tokenUri = nftContract.tokenURI(item.tokenId);
            return tokenUri;
        });


        const URIs = await Promise.all(URIPromises);

        const URIsModified = URIs.map((uri) => {
            return uri.replace(regex, process.env.REACT_APP_IPFS_PROVIDER);
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
                nft: metadata.data.nft,
                tokenId: metadata.data.tokenId
            };
        });

        return { items, metadataArrModified };
    } catch (error) {
        console.log(error);
    }
}

const getItem = async (id) => {
    const provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_API_KEY);
    const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, provider);

    const item = await contract.items(id)

    const nftContract = new ethers.Contract(item.nftContract, erc721ABI, provider);

    const tokenUri = (await nftContract.tokenURI(item.tokenId)).replace(regex, process.env.REACT_APP_IPFS_PROVIDER);

    const metadata = await axios.get(tokenUri);

    metadata.data.image = metadata.data.image.replace('ipfs://', process.env.REACT_APP_IPFS_PROVIDER);

    return { item, metadata };
}

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

const loadCollectionItems = async (provider, collectionAddress) => {
    try {
        const collectionContract = new ethers.Contract(
            collectionAddress,
            erc721ABI,
            provider,
        );

        const tokenIds = await getItemsTokenIds(collectionContract);

        const URIPromises = tokenIds.map((tokenId) => {
            const tokenUri = collectionContract.tokenURI(tokenId);
            return tokenUri;
        });

        const URIs = await Promise.all(URIPromises);

        const regex = new RegExp(`^ipfs:\/\/|^ipfs;\/\/`);

        const URIsModified = URIs.map((uri) => {
            return uri.replace(regex, process.env.REACT_APP_IPFS_PROVIDER)
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
                nft: metadata.data.nft,
                tokenId: metadata.data.tokenId
            };
        });

        return metadataArrModified
    }
    catch (err) {
        console.log(err);
    }
};

const getItemsTokenIds = async (contract) => {
    const eventFilter = contract.filters.Transfer([ethers.constants.AddressZero]);
    const events = await contract.queryFilter(eventFilter);

    const arrIds = events.map((event) => {
        return event.args.tokenId.toNumber();
    });

    return arrIds;
}

const addItemToMarketplace = async (provider, collectionAddress, tokenId) => {
    try {
        const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, provider);

        const eventFilter = contract.filters.LogCollectionAdded();
        const collectionid = (await contract.queryFilter(eventFilter)).filter((event) => event.args.nftCollection === collectionAddress)[0].args.id;

        const transaction = await contract.addItem(collectionid, tokenId, { gasLimit: 300000 });

        await transaction.wait();

        return transaction.status;
    } catch (error) {
        console.log(error);
    }
}

const loadItemsForListing = async (provider, address) => {
    try {
        const { items, metadataArrModified } = await loadItems(provider);

        const filteredItems = items.filter(item => item.owner === address && parseInt(item.price) === 0);

        const ids = filteredItems.map(item => parseInt(item.tokenId));

        const nfts = metadataArrModified.filter(item => ids.includes(item.tokenId));

        return { filteredItems, nfts };
    } catch (error) {
        console.log(error);
    }
}

const listItemForSale = async (provider, collectionAddress, tokenId, price) => {
    try {
        const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, provider);

        const items = await loadItems(provider);
        const itemId = parseInt(items.items.filter(item => item.nftContract === collectionAddress && parseInt(item.tokenId) === tokenId)[0].id);

        const transaction = await contract.listItem(itemId, price, { gasLimit: 300000 });

        const nftContract = new ethers.Contract(collectionAddress, erc721ABI, provider);
        const approveTransaction = await nftContract.approve(marketplaceContract.address, tokenId, { gasLimit: 300000 });

        await transaction.wait();
        await approveTransaction.wait();

        return transaction.status;
    } catch (error) {
        console.log(error);
    }
}

const buyItem = async (signer, itemId, price) => {
    try {
        const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, signer);

        const transaction = await contract.buyItem(itemId, { value: price, gasLimit: 300000 });

        await transaction.wait();

        return transaction.status;
    } catch (error) {
        console.log(error);
    }
}

const addExistingCollection = async (signer, address) => {
    try {
        const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, signer);

        const transaction = await contract.addCollection(address, { gasLimit: 300000 });

        await transaction.wait();

        return transaction.status;
    } catch (error) {
        console.log(error);
    }
}

export { loadItems, loadCollections, loadCollectionItems, addItemToMarketplace, getItem, loadItemsForListing, listItemForSale, buyItem, addExistingCollection };

