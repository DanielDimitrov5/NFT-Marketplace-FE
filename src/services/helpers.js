import { ethers } from "ethers";
import { erc721ABI } from "wagmi";

export default async function loadCollections(contract) {
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