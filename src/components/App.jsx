import { useEffect, useState } from 'react';
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

import { marketplaceContract, infuraProvider } from '../services/helpers';
import nftABI from '../contractData/abi/NFT.json';
import nftBytecode from '../contractData/NftBytecode.json';
import ErrorBoundary from './ErrorBoundary';
import NFTMarketplaceSDK from 'nft-mp-sdk';
import SDKContext from '../sdkContext';
import Cookies from 'js-cookie';

function App() {
  const [sdk, setSdk] = useState(null);

  const { provider } = configureChains([sepolia], [publicProvider()]);

  const client = createClient({
    provider,
    autoConnect: true,
  });

  useEffect(() => {
    const sdk = new NFTMarketplaceSDK(
      infuraProvider,
      marketplaceContract.address,
      marketplaceContract.abi,
      nftABI,
      nftBytecode.bytecode,
      process.env.REACT_APP_IPFS_PROVIDER,
    );
    setSdk(sdk);
  }, []);

  if (!sdk) return null;

  return (
    <BrowserRouter>
      <WagmiConfig client={client}>
        <SDKContext.Provider value={sdk}>
          <ErrorBoundary>
            <div className="wrapper">
              <Header />
              <div
                className={
                  'main ' + (Cookies.get('bg-theme') === 'dark' ? 'dark-background' : null)
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/item/:id" element={<Item />} />
                  <Route path="/create-collection" element={<CreateCollection />} />
                  <Route path="/mint-from" element={<MintFrom />} />
                  <Route path="/mint-from/:id" element={<MintNFT />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/collections/:id" element={<Collection />} />
                  <Route path="/add-item-from" element={<AddItem />} />
                  <Route path="/add-item-from/:id" element={<ChooseItem />} />
                  <Route path="/list-item" element={<ListItem />} />
                  <Route path="/my-items" element={<MyItems />} />
                  <Route path="/my-items/:id" element={<ItemDashboard />} />
                  <Route path="/my-offers" element={<MyOfferes />} />
                  <Route path="/user/:id" element={<UserPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </ErrorBoundary>
        </SDKContext.Provider>
      </WagmiConfig>
    </BrowserRouter>
  );
}

export default App;
