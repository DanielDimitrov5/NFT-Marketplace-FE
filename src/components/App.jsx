import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import Home from '../pages/Home';
import Item from '../pages/Item';
import CreateCollection from '../pages/CreateCollection';
import Collections from '../pages/Collections';
import MintFrom from '../pages/MintFrom';
import MintNFT from '../pages/MintNFT';
import AddExistingCollection from '../pages/AddExistingCollection';
import AddItem from '../pages/AddItem';
import ChooseItem from '../pages/ChooseItem';
import Collection from '../pages/Collection';
import ListItem from '../pages/ListItem';
import MyItems from '../pages/MyItems';
import ItemDashboard from '../pages/ItemDashboard';
import MyOfferes from '../pages/MyOffers';
import UserPage from '../pages/UserPage';
import NotFound from './NotFound';

import Header from './layout/Header';
import Footer from './layout/Footer';

import NFTMarketplaceSDK from 'nft-mp-sdk';
import { useEffect, useState } from 'react';
import { ethers, providers } from 'ethers';
import { marketplaceContract } from '../services/helpers';
import nftABI from '../contractData/abi/NFT.json';
import nftBytecode from '../contractData/NftBytecode.json'
import SDKContext from '../sdkContext';

function App() {
    const [sdk, setSdk] = useState(null);

    const { provider } = configureChains([sepolia], [publicProvider()]);

    const client = createClient({
        provider,
        autoConnect: true
    });

    useEffect(() => {
        let provider;

        if (window.ethereum) {
            provider = new ethers.providers.Web3Provider(window.ethereum).getSigner();
        }
        else {
            provider = new providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_API_KEY);
        }

        const sdk = new NFTMarketplaceSDK(provider, marketplaceContract.address, marketplaceContract.abi, nftABI, nftBytecode.bytecode);
        setSdk(sdk);
    }, []);

    if (!sdk) return null;

    return (
        <BrowserRouter>
            <WagmiConfig client={client}>
                <SDKContext.Provider value={sdk}>
                    <div className="wrapper">
                        <Header />
                        <div className="main">
                            <Routes>
                                <Route path="/" element={<Home sdk={sdk} />} />
                                <Route path="/item/:id" element={<Item />} />
                                <Route path="/create-collection" element={<CreateCollection />} />
                                <Route path="/add-existing-collection" element={<AddExistingCollection />} />
                                <Route path="/mint-from" element={<MintFrom />} />
                                <Route path="/mint-from/:id" element={<MintNFT />} />
                                <Route path="/collections" element={<Collections />} />
                                <Route path="/collections/:id" element={<Collection />} />
                                <Route path="/add-item-from" element={<AddItem />} />
                                <Route path="/add-item-from/:id" element={<ChooseItem />} />
                                <Route path="/list-item" element={<ListItem />} />
                                <Route path="/my-items" element={<MyItems />} />
                                <Route path="/my-items/:id" element={<ItemDashboard />} />
                                <Route path='/my-offers' element={<MyOfferes />} />
                                <Route path='/user/:id' element={<UserPage />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </div>
                        <Footer />
                    </div>
                </SDKContext.Provider>
            </WagmiConfig>
        </BrowserRouter>
    );
}

export default App;
