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

function App() {
    const { provider } = configureChains([sepolia], [publicProvider()]);

    const client = createClient({
        provider,
        autoConnect: true
    });

    return (
        <BrowserRouter>
            <WagmiConfig client={client}>
                <div className="wrapper">
                    <Header />
                    <div className="main">
                        <Routes>
                            <Route path="/" element={<Home />} />
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
            </WagmiConfig>
        </BrowserRouter>
    );
}

export default App;
