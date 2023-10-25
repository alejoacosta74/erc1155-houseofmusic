import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from "react";
import { EthereumContext } from './EthereumProvider';
import { ethers } from 'ethers';
import axios from 'axios';
import {  uploadJSONToCouchDB } from '../utils/couchdb';
import { getNextImsiAndRange } from '../utils/tools';

export default function TokenPage () {
   const { readContract, writeContract, address} = useContext(EthereumContext);
   const [token, setToken] = useState(null);
   const { tokenId } = useParams();
   const [currSupply, setCurrSupply] = useState(null);
   
   useEffect(() => {
      const fetchTokenData = async () => {
         if (!readContract) return;
         const tokenURI = await readContract.uri(tokenId);
         const tokenData = await axios.get(tokenURI);
         const supply = await readContract.totalSupply(tokenId);
         setCurrSupply(supply.toString());
         if (tokenData.data) setToken(tokenData.data);
      };
      
      fetchTokenData();
   }, [readContract, tokenId]);
   
   const handlePurchase = async () => {
      if (!writeContract) {
         alert('Please connect your wallet.');
         return;
      }
      
      try {
         const salePrice = ethers.utils.parseUnits(token.tokenPrice.toString(), 'ether');
         let transaction = await writeContract.purchaseNonFungibleToken(tokenId, {value: salePrice, gasLimit: 1000000});
         let receipt = await transaction.wait();
         console.log("TokenPage => receipt: ", receipt)
         const supply = await readContract.totalSupply(tokenId);
         setCurrSupply(supply.toString());
         
         // Find the mint event
         let mintEvent = receipt.events.find(e => e.event === 'NonFungibleTokenPurchased');
         let newNFTId = mintEvent.args.nonFungibleTokenID.toString();
         console.log("TokenPage => newNFTId: ", newNFTId)
         
         // Fetch the current fungible token metadata from CouchDB
         const metadataUrl = await readContract.uri(tokenId);
         const metadataRes = await axios.get(metadataUrl);
         const metadata = metadataRes.data;
         console.log("TokenPage => metadata: ", metadata)

         // construct the NFT metada and upload it to CouchDB
         const nftMetadata = {
            imageURL: metadata.imageURL,
            tokenId: newNFTId,
            organizerAddress: metadata.organizerAddress,
            concertDescription: metadata.concertDescription,
            artistName: metadata.artistName,
            price: token.tokenPrice.toString(),
         };
         
         const nftURI = await writeContract.uri(newNFTId);
         await uploadJSONToCouchDB(nftURI, nftMetadata);
         console.log("TokenPage => nftMetadata: ", nftMetadata)
         console.log("TokenPage => succesfully minted nft id: ", newNFTId)
         alert("New NFT successfully minted. Your token id is: " + newNFTId);
         
      } catch (error) {
         console.error("Error while purchasing the token: ", error);
      }
   };
   
   if (!token) {
      return <div>Loading...</div>;
   }

   console.log("TokenPage => token: ", token)
   
   return (
      <div style={{"min-height":"100vh"}}>
         <div className="flex ml-20 mt-20">
         {token.imageURL && <img src={token.imageURL} alt="" className="w-2/5" />}
            <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
               {
                  Object.entries(token).slice(3,7).map(([key, value]) => (
                     <p key={key} className="display-inline">{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}</p>
                  ))
               }  
                <p className="display-inline">Current Supply: {currSupply}</p>    
                <p className="display-inline">
                {
                  address === "0x" ?
                  <div className="text-sm ml-10 space-y-5  shadow-2xl rounded-lg border-5 p-5 text-red"> 
                  Connect your wallet to purchase this token
                  </div>
                  :
                  <button 
                  className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                  onClick={handlePurchase}
                  >
                     Purchase NFT
                  </button>
               } 
                </p>
            </div>
         </div>

      </div>
      );
   }
