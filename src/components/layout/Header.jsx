import React, { useState, useEffect } from 'react';
import { useConnect, useAccount, useBalance, useDisconnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { sepolia } from 'wagmi/chains';

import { truncate } from '../../utils';

import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import { successMessage } from '../../services/alertMessages';
import { ethers } from 'ethers';
import { infuraProvider } from '../../services/helpers';
import { useSDK } from '../../hooks/useSDK';
import { FaCircleHalfStroke } from 'react-icons/fa6';
import Cookies from 'js-cookie';

import md5 from 'md5';

function Header() {
  const sdk = useSDK();

  const [currentSelection, setCurrentSelection] = useState('Home');
  const [isOwner, setIsOwner] = useState(false);
  const [marketplaceBalance, setMarketplaceBalance] = useState(0);

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

  const { disconnect } = useDisconnect();

  const handleConnectButtonClick = async () => {
    connect();
  };

  const handleDisconnectButtonClick = async () => {
    disconnect();
  };

  const handleSelect = e => {
    setCurrentSelection(e.target.text);
  };

  const handleWithdraw = async () => {
    if (isConnected) {
      const result = await sdk.withdrawMoney();
      if (result === 1) {
        successMessage('Withdraw successful!');
      }
    }
  };

  const checkOwner = async () => {
    if (isConnected) {
      const result = await sdk.isMarketplaceOwner(address);
      setIsOwner(result);
    }
  };

  const getBalance = async () => {
    if (isConnected) {
      const result = await sdk.getMarketplaceBalance();

      setMarketplaceBalance(result);
    }
  };

  useEffect(() => {
    if (isConnected) {
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      sdk.connectSigner(signer);
    } else {
      sdk.connectSigner(infuraProvider);
    }

    checkOwner();
    getBalance();
  }, [isConnected, address]);

  return (
    <div className="header-wrapper">
      <div
        className={
          'header ' +
          (Cookies.get('bg-theme') === 'dark' ? 'dark-background-1' : 'light-background')
        }
      >
        <div className="container d-flex justify-content-between align-item-center">
          <Link to={'/'}>
            <img
              src="https://limeacademy.tech/wp-content/uploads/2021/08/limeacademy_logo.svg"
              alt=""
            />
          </Link>
          <Nav>
            <NavDropdown title={currentSelection}>
              <NavDropdown.Item as={Link} to={'/'} onClick={handleSelect}>
                Home
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={'/create-collection'} onClick={handleSelect}>
                Create NFT collection
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={'/mint-from'} onClick={handleSelect}>
                Mint
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={'/collections'} onClick={handleSelect}>
                View NFT collections
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={'/add-item-from'} onClick={handleSelect}>
                Add item
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={'/list-item'} onClick={handleSelect}>
                List item
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={'/my-items'} onClick={handleSelect}>
                My Items
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={'/my-offers'} onClick={handleSelect}>
                My Offers
              </NavDropdown.Item>
            </NavDropdown>
            <FaCircleHalfStroke
              fill={Cookies.get('bg-theme') === 'dark' ? 'white' : 'black'}
              className="nav-icon"
              onClick={e => {
                let theme = Cookies.get('bg-theme');
                if (theme === 'dark') {
                  Cookies.set('bg-theme', 'white', { expires: 7 });
                  window.location.reload(false);
                } else {
                  Cookies.set('bg-theme', 'dark', { expires: 7 });
                  window.location.reload(false);
                }
              }}
            />
          </Nav>
          <div className="d-flex">
            {isLoading ? (
              <span>Connecting...</span>
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
                  <span className="mx-3">|</span>
                  <NavDropdown title="Account" id="basic-nav-dropdown">
                    <NavDropdown.Item onClick={handleDisconnectButtonClick}>
                      Disconnect
                    </NavDropdown.Item>
                    {isOwner && (
                      <NavDropdown.Item onClick={handleWithdraw}>Withdraw money</NavDropdown.Item>
                    )}
                  </NavDropdown>
                </div>
              </>
            ) : (
              <button className="btn btn-primary" onClick={handleConnectButtonClick}>
                Connect Metamask
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
