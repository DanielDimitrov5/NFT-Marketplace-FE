import { erc721ABI } from "wagmi";
import axios from "axios";
import marketplaceABI from '../contractData/abi/NFTMarketplace.json';
import { ethers } from "ethers";
import { infuraIpfsClient } from "./ipfsClient";
import nftABI from "../contractData/abi/NFT.json";

const marketplaceContract = {
    address: '0x705279FAE070DEe258156940d88A6eCF5B302073',
    abi: marketplaceABI,
}

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
                nft: metadata.data.nft,
                tokenId: items[metadataArr.indexOf(metadata)].tokenId,
                owner: items[metadataArr.indexOf(metadata)].owner,
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

    const tokenUri = (await nftContract.tokenURI(item.tokenId)).replace('ipfs://', process.env.REACT_APP_IPFS_PROVIDER);

    const metadata = await axios.get(tokenUri);

    metadata.data.image = metadata.data.image.replace('ipfs://', process.env.REACT_APP_IPFS_PROVIDER);

    return { item, metadata };
}

const loadCollections = async (provider) => {
    try {
        const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, provider);

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

        console.log(resolvedCollections);

        return resolvedCollections;

    } catch (err) {
        console.log(err);
    }
}

const loadItemsForAdding = async (provider, collectionAddress, address) => {
    const contract = new ethers.Contract(collectionAddress, erc721ABI, provider);

    const itemsMarketplaceItemsIds = (await loadItems(provider)).items.filter((item) => {
        return item.nftContract === collectionAddress;
    }).map((item) => parseInt(item.tokenId));

    const ids = (await getItemsTokenIds(contract)).filter((id) => {
        return !itemsMarketplaceItemsIds.includes(id);
    });

    const promisesOwners = ids.map((id) => {
        return contract.ownerOf(id);
    });

    const owners = await Promise.all(promisesOwners);

    const idsFiltered = ids.filter((id, i) => {
        return owners[i] === address;
    });

    const promises = idsFiltered.map((id) => {
        return contract.tokenURI(id);
    });

    const URIs = (await Promise.all(promises)).map((uri) => {
        return uri.replace('ipfs://', process.env.REACT_APP_IPFS_PROVIDER);
    });

    const metadataPromises = URIs.map((uri) => {
        return axios.get(uri);
    });

    const metadataArr = await Promise.all(metadataPromises);

    const metadataArrModified = metadataArr.map((metadata, i) => {
        return {
            ...metadata,
            name: metadata.data.name,
            image: metadata.data.image.replace('ipfs://', process.env.REACT_APP_IPFS_PROVIDER),
            description: metadata.data.description,
            nft: metadata.data.nft,
            tokenId: ids[i]
        };
    });

    return metadataArrModified;
}

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

        const tx = await transaction.wait();
        return tx.status;
    } catch (error) {
        console.log(error);
    }
}

const loadItemsForListing = async (provider, address) => {
    try {
        const { items, metadataArrModified } = await loadItems(provider);

        const filteredItems = items.filter(item => item.owner === address && parseInt(item.price) === 0);

        const nfts = metadataArrModified.filter((item) => {
            return filteredItems.some((item2) => {
                return parseInt(item.tokenId) === parseInt(item2.tokenId) && item.nft === item2.nftContract;
            });
        });

        return { filteredItems, nfts };
    } catch (error) {
        console.log(error);
    }
}

const listItemForSale = async (provider, collectionAddress, tokenId, price) => {
    if (price <= 0) {
        alert('Price must be greater than 0');
        return;
    }

    try {
        const nftContract = new ethers.Contract(collectionAddress, erc721ABI, provider);
        const approveTransaction = await nftContract.approve(marketplaceContract.address, tokenId, { gasLimit: 300000 });
        const aprrovalTx = await approveTransaction.wait();

        if (aprrovalTx.status === 1) {
            const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, provider);

            const items = await loadItems(provider);

            const itemId = parseInt(items.items.filter(item => item.nftContract === collectionAddress && parseInt(item.tokenId) === parseInt(tokenId))[0].id);

            const transaction = await contract.listItem(itemId, price, { gasLimit: 300000 });

            const tx = await transaction.wait();

            return tx.transaction.status;
        }
        else {
            alert('Approval failed');
        }
    } catch (error) {
        console.log(error);
    }
}

const buyItem = async (signer, itemId, price) => {
    try {
        const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, signer);

        const transaction = await contract.buyItem(itemId, { value: price, gasLimit: 300000 });

        const tx = await transaction.wait();

        return tx.status;
    } catch (error) {
        console.log(error);
    }
}

const addExistingCollection = async (signer, address) => {
    try {
        const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, signer);

        const transaction = await contract.addCollection(address, { gasLimit: 300000 });

        const tx = await transaction.wait();

        return tx.status;
    } catch (error) {
        console.log(error);
    }
}

const approveCollection = async (signer, collectionAddress) => {
    try {
        const contract = new ethers.Contract(collectionAddress, erc721ABI, signer);

        const transaction = await contract.setApprovalForAll(marketplaceContract.address, true, { gasLimit: 300000 });

        const tx = await transaction.wait();

        return tx.status;
    } catch (error) {
        console.log(error);
    }
}

const mintNFT = async (signer, collectionAddress, metadata) => {

    const { image } = metadata;

    const imageHash = await uploadToIPFS(image);

    metadata.image = imageHash;
    metadata.nft = collectionAddress;

    try {
        const contract = new ethers.Contract(collectionAddress, nftABI, signer);

        const metadataURI = await uploadToIPFS(JSON.stringify(metadata));

        const transaction = await contract.mint(metadataURI, { gasLimit: 300000 });

        const tx = await transaction.wait();

        return tx.status;
    } catch (error) {
        console.log(error);
    }
}

const uploadToIPFS = async (file) => {
    try {
        const addedFile = await infuraIpfsClient.add(file);
        const hash = addedFile.path;

        return 'ipfs://' + hash;
    } catch (err) {
        console.log(err);
        return;
    }
}

const placeOffer = async (signer, itemId, price) => {
    try {
        const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, signer);

        const transaction = await contract.placeOffer(itemId, price, { gasLimit: 300000 });

        const tx = await transaction.wait();

        return tx.status;
    } catch (error) {
        console.log(error);
    }
}

const getOffers = async (provider, itemId) => {
    try {
        const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, provider);

        const offerers = [...new Set(await contract.getOfferers(itemId))];

        const offerssPromises = offerers.map(async (offerer) => {
            return contract.offers(itemId, offerer);
        });

        const offers = await Promise.all(offerssPromises);

        const offersModified = offers.map((offer, i) => {
            return {
                offerer: offerers[i],
                price: offer.price,
                isAccepted: offer.isAccepted
            }
        });

        return offersModified;
    } catch (error) {
        console.log(error);
    }

}

const acceptOffer = async (signer, itemId, offerer) => {
    try {

        const item = (await getItem(itemId)).item;
        const nftContractAddress = item.nftContract;
        const tokenId = item.tokenId;

        const approve = await checkApproval(signer, nftContractAddress, tokenId);

        if (approve != marketplaceContract.address) {
            const nftContract = new ethers.Contract(nftContractAddress, erc721ABI, signer);
            const approveTransaction = await nftContract.approve(marketplaceContract.address, tokenId, { gasLimit: 300000 });

            const aprrovalTx = await approveTransaction.wait();

            if (aprrovalTx.status !== 1) {
                alert('Approval failed');
                return;
            }
        }

        const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, signer);

        const transaction = await contract.acceptOffer(itemId, offerer, { gasLimit: 300000 });

        const tx = await transaction.wait();

        return tx.status;
    } catch (error) {
        console.log(error);
    }
}

const checkApproval = async (provider, collectionAddress, tokenId) => {
    try {
        const contract = new ethers.Contract(collectionAddress, erc721ABI, provider);

        const approved = await contract.getApproved(tokenId);

        return approved;
    } catch (error) {
        console.log(error);
    }
}

const getAccountsOffers = async (provider, address) => {
    try {
        const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, provider);

        const itemCount = await contract.itemCount();

        const itemCountArr = [...Array(parseInt(itemCount)).keys()].map(i => i + 1);

        const getOffersPromises = itemCountArr.map(async (id) => {
            const offer = contract.offers(id, address);
            return offer;
        });

        const offers = (await Promise.all(getOffersPromises)).filter(offer => offer.itemId.toNumber() !== 0);

        const itemIds = offers.map(offer => offer.itemId.toNumber());

        const itemsPromises = itemIds.map(async (id) => {
            const item = contract.items(id);
            return item;
        });

        const itemsOwners = (await Promise.all(itemsPromises)).map(item => item.owner);

        const offersModified = offers.filter((offer, i) => offer.seller === itemsOwners[i]);

        return offersModified;
    }
    catch (error) {
        console.log(error);
    }
}

const claimItem = async (signer, itemId, price) => {
    try {
        const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, signer);

        const transaction = await contract.claimItem(itemId, { value: price, gasLimit: 300000 });

        const tx = await transaction.wait();

        return tx.status;
    } catch (error) {
        console.log(error);
    }

}

const isMarketpkaceOwner = async (provider, address) => {
    try {
        const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, provider);

        const owner = await contract.owner();

        return owner === address;
    } catch (error) {
        console.log(error);
    }
}

const withdrawMoney = async (signer) => {
    try {
        const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, signer);

        const transaction = await contract.withdraw({ gasLimit: 300000 });

        const tx = await transaction.wait();

        return tx.status;
    } catch (error) {
        console.log(error);
    }
}

const getMarketplaceBalance = async (provider) => {
    try {
        const balance = await provider.getBalance(marketplaceContract.address);

        return balance;
    } catch (error) {
        console.log(error);
    }
}

export {
    loadItems, loadCollections, addItemToMarketplace,
    getItem, loadItemsForListing, listItemForSale, buyItem,
    addExistingCollection, mintNFT, loadItemsForAdding, placeOffer,
    getOffers, acceptOffer, getAccountsOffers, claimItem, isMarketpkaceOwner,
    withdrawMoney, getMarketplaceBalance
};

