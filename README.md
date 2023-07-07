# NFT Marketplace DApp with React

This repository contains a decentralized application (DApp) built using React.js that interacts with an NFT Marketplace smart contract. The application uses the NFT Marketplace SDK to facilitate interactions with the Ethereum blockchain.

[NFT-Marketplace contracts](https://github.com/DanielDimitrov5/NFT-Marketplace-Project)

[NFT-Marketplace-SDK](https://github.com/DanielDimitrov5/NFT-Marketplace-SDK)

## Table of Contents

- [Getting Started](#getting-started)
- [Routes Description](#routes-description)
- [Images](#images)
- [Installation](#installation)
- [Usage](#usage)
- [Built With](#built-with)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

Before running this application, make sure you have installed `node` and `npm` on your system.

## Routes Description

- `/` - The home page of the DApp. Main landing page with an overview of the marketplace.

- `/item/:id` - Displays detailed information about a single NFT item based on the given ID.

- `/create-collection` - Allows users to create a new NFT collection.

- `/mint-from` - Displays a list of collections from which a user can mint NFTs.

- `/mint-from/:id` - Allows users to mint new NFTs from a specific collection based on the given ID.

- `/collections` - Displays a list of all collections available in the marketplace.

- `/collections/:id` - Displays all nfts from a collection.

- `/add-item-from` - Displays a list of collections from which a user can add items to the marketplace.

- `/add-item-from/:id` - Allows users to choose items to add to the marketplace from a specific collection based on the given ID.

- `/list-item` - Allows users to list items for sale in the marketplace.

- `/my-items` - Displays a list of items owned by the current user.

- `/my-items/:id` - Allows users to manage a specific item based on the given ID.

- `/my-offers` - Displays a list of offers made by the user.

- `/user/:id` - Displays all items owned by a user based on the given ID.

## Images

### Home page
![Homepage Screenshot](https://i.imgur.com/zaaAOsz.png)
### Item page
![Item Page](https://i.imgur.com/FsmroCC.png)
### Mint NFT page
![Mint NFT Screenshot](https://i.imgur.com/ZyaqfFr.png)
### My offers page
![My Offers Screenshot](https://i.imgur.com/NT0qAos.png)

## Installation

1. Clone the repository.
2. Install the dependencies with `npm install`.
3. Set up your environment variables.

## Usage

- Start the development server with `npm start`.
- Build the application for production with `npm run build`.

## 🛠 Built with:

This project is built using the following dependencies:

- [react](https://www.npmjs.com/package/react) ^18.2.0
- [antd](https://www.npmjs.com/package/antd) ^5.6.1
- [ethers](https://www.npmjs.com/package/ethers) ^5.7.2
- [ipfs-http-client](https://www.npmjs.com/package/ipfs-http-client) ^60.0.1
- [nft-mp-sdk](https://www.npmjs.com/package/nft-mp-sdk) ^1.1.2
- [react-router-dom](https://www.npmjs.com/package/react-router-dom) ^6.3.0
- [wagmi](https://www.npmjs.com/package/wagmi) ^0.10.10

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.