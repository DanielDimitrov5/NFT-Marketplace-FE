import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import { ethers } from 'ethers';

import Home from '../pages/Home';
import Item from '../pages/Item';
import Styleguide from '../pages/Styleguide';

import Header from './layout/Header';
import Footer from './layout/Footer';

import ContractContext from '../contexts/ContractContext';
import marketplaceABI from '../abi/NFTMarketplace.json';

const marketplaceContract = {
    address: '0xa79Ef7898394B79b809043B9CDE8Dbc1f3550E02',
    abi: marketplaceABI,
}

function App() {
    const [contract, setContract] = useState();

    const { provider } = configureChains([sepolia], [publicProvider()]);

    const client = createClient({
        provider,
        autoConnect: true,
    });

    const getContract = async () => {
        const provider = new ethers.providers.InfuraProvider(process.env.NETWORK, process.env.API_KEY);
        const contract = new ethers.Contract(marketplaceContract.address, marketplaceContract.abi, provider);
        setContract(contract);
    };

    useEffect(() => {
        getContract();
    }, []);

    return (
        <BrowserRouter>
            <ContractContext.Provider value={contract}>
                <WagmiConfig client={client}>
                    <div className="wrapper">
                        <Header />
                        <div className="main">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/item/:id" element={<Item />} />
                                <Route path="styleguide" element={<Styleguide />} />
                            </Routes>
                        </div>
                        <Footer />
                    </div>
                </WagmiConfig>
            </ContractContext.Provider>
        </BrowserRouter>
    );
}

export default App;
