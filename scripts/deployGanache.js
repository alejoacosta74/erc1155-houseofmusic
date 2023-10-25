require('dotenv').config();
const { ethers } = require("ethers");
const fs = require("fs");
const MarketplaceArtifact = require("../artifacts/contracts/TokenMarketPlace.sol/TokenMarketPlace.json"); 
ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.DEBUG);

async function main() {
  console.log(`Deploying Marketplace contract to http://127.0.0.1:${process.env.GANACHE_PORT}...`)
  const provider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:${process.env.GANACHE_PORT}`);

  // Use the PRIVATE_KEY from the .env file to create a signer
  const signer = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY, provider);
  let balance
  try {
	  console.log("calling getBalance...")
	  balance = await signer.getBalance('latest');
	  console.log("signer balance", balance.toString())
	
  } catch(e) {
	  console.log("error when calling getBalance", e)
  }

  console.log("Deploying contracts with account: ", signer.address);
  console.log("Account balance: ", ethers.utils.formatEther(balance).toString());

  // Create a ContractFactory and pass it the signer
  const Marketplace = new ethers.ContractFactory(MarketplaceArtifact.abi, MarketplaceArtifact.bytecode, signer);

  // Deploy the contract
  let marketplace
  try{
	console.log("calling deploy...")
	marketplace = await Marketplace.deploy();
	console.log("Deploying Marketplace...");
	await marketplace.deployed();
	console.log("Marketplace deployed to: ", marketplace.address);
  } catch(e) {
	  console.log("error when deploying Marketplace", e)
	    }
  const data = {
    address: marketplace.address,
    abi: marketplace.interface.format('json')
  }

  // This writes the ABI and address to the Marketplace.json
  fs.writeFileSync('./src/Marketplace.json', JSON.stringify(data))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
