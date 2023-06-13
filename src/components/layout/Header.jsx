import React, { useState } from 'react';
import { useConnect, useAccount, useBalance } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { sepolia } from 'wagmi/chains';

import { truncate } from '../../utils';

import Button from '../ui/Button';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';

const md5 = require('md5');

function Header() {
    const [currentSelection, setCurrentSelection] = useState('Home')

    const connector = new MetaMaskConnector({
        chains: [sepolia],
    });

    const { isConnected, address } = useAccount();
    const { connect, isLoading } = useConnect({
        connector,
    });

    const { data } = useBalance({
        address,
    });

    const handleConnectButtonClick = async () => {
        await connect();
    };

    const handleSelect = (e) => {
        setCurrentSelection(e.target.text)
    }

    return (
        <div className="header-wrapper">
            <div className="header">
                <div className="container d-flex justify-content-between align-item-center">
                    <a href="/">
                        <img
                            src="https://limeacademy.tech/wp-content/uploads/2021/08/limeacademy_logo.svg"
                            alt=""
                        />
                    </a>
                    <Nav>
                        <NavDropdown
                            title={currentSelection}
                        >
                            <NavDropdown.Item as={Link} to={'/'} onClick={handleSelect}>Home</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={'/create-collection'} onClick={handleSelect}>Create NFT collection</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={'/collections'} onClick={handleSelect}>View NFT collections</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2" onClick={handleSelect}>
                                Add item
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3" onClick={handleSelect}>List Item</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <div className="d-flex">
                        {isLoading ? (
                            <span>Loading...</span>
                        ) : isConnected ? (
                            <>
                                <div className="d-flex align-items-center justify-content-end">
                                    <img
                                        className="img-profile me-3"
                                        src={`https://www.gravatar.com/avatar/${md5(address)}/?d=identicon`}
                                        alt=""
                                    />
                                    <span>{truncate(address, 6)}</span>
                                    <span className="mx-3">|</span>
                                    <p>
                                        <span className="fw-bold">Balance: </span>
                                        <span>{Number(data && data.formatted).toFixed(3)} ETH</span>
                                    </p>
                                </div>
                            </>
                        ) : (
                            <Button onClick={handleConnectButtonClick}>Connect Metamask</Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
