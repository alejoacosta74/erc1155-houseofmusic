require('dotenv').config();
const { ethers } = require("hardhat");
const hre = require("hardhat");
const contractAddress = require("../src/Marketplace.json").address;

async function main() {

	const Marketplace = await hre.ethers.getContractFactory("HouseOfMusic");
	const marketplace = Marketplace.attach(contractAddress);
	const metadataURL = 'http://localhost:5984/houseofmusic/67cba37766c77db2e9bff72f19003679';
	const price = ethers.utils.parseUnits('0.01', 'ether');
	let listingPrice
	try{
		listingPrice = await marketplace.getListPrice();
		console.log("listingPrice", listingPrice.toString())
	} catch(e) {
		console.log("error when calling getListPrice", e)
	}

	try{
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
