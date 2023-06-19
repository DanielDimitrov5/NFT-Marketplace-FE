import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import Home from '../pages/Home';
import Item from '../pages/Item';
import CreateCollection from '../pages/CreateCollection';
import Collections from '../pages/Collections';
import AddItem from '../pages/AddItem';
import ChooseItem from '../pages/ChooseItem';
import Collection from '../pages/Collection';
import ListItem from '../pages/ListItem';
import Styleguide from '../pages/Styleguide';

import Header from './layout/Header';
import Footer from './layout/Footer';

function App() {
    const { provider } = configureChains([sepolia], [publicProvider()]);

    const client = createClient({
        provider,
        autoConnect: true,
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
                            <Route path="/collections" element={<Collections />} />
                            <Route path="/collections/:id" element={<Collection />} />
                            <Route path="/add-item-from" element={<AddItem />} />
                            <Route path="/add-item-from/:id" element={<ChooseItem />} />
                            <Route path="/list-item" element={<ListItem />} />
                            <Route path="styleguide" element={<Styleguide />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </WagmiConfig>
        </BrowserRouter>
    );
}

export default App;
