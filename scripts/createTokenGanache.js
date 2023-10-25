require('dotenv').config();
const { ethers } = require("hardhat");
const contractAddress = require("../src/Marketplace.json").address;
const contractAbi = require("../src/Marketplace.json").abi;

async function main() {
	// add Ganache endpoint as the provider
	const provider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:${process.env.GANACHE_PORT}`);
 	const signer = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY, provider);
	const marketplace = new ethers.Contract(contractAddress, contractAbi, signer);
	const metadataURL = 'http://localhost:5984/houseofmusic/67cba37766c77db2e9bff72f19003679';
	const price = ethers.utils.parseUnits('0.01', 'ether');
	let listingPrice
	try{
		console.log("calling getListPrice...")
		listingPrice = await marketplace.getListPrice();
		console.log("listingPrice", listingPrice.toString())
	} catch(e) {
		console.log("error when calling getListPrice", e)
	}

	try{
		console.log("calling createToken...")
		const transaction = await marketplace.createToken(metadataURL, price, { value: listingPrice });
		console.log("Transaction createToken executed succesfully:", transaction);
		let result = await transaction.wait();
		console.log("Transaction createToken mined:", result);
	} catch(e) {
		console.log("error when calling createToken", e)
	}

  }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
