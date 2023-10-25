import React, { useContext, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from '../utils/validationSchema';
import formSchema from '../utils/formSchema.json';
import { EthereumContext } from "./EthereumProvider";
import { uploadImageToCouchDB, uploadJSONToCouchDB } from "../utils/couchdb";
import { ethers } from 'ethers';


const MintOrder = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const { address, writeContract : contract } = useContext(EthereumContext);

  const onSubmit = async (data) => {
    try {
      console.log('data:', data);
      // Mint the new fungible token
      console.log("minting token");
      let priceInWei = ethers.utils.parseEther(data.tokenPrice.toString());
      let tx = await contract.mintFungibleToken(data.organizerAddress, data.totalSupply, priceInWei.toString());
      console.log("waiting for tx to be mined");
      let receipt = await tx.wait();
      console.log("tx mined with receipt: ", receipt);
      // Find the TransferSingle event in the receipt
      let mintEvent = receipt.events.find(e => e.event === 'FungibleTokenAdded');
      console.log("mintEvent: ", mintEvent);
      // Extract the tokenId from the event
      let tokenId = mintEvent.args.fungibleTokenID.toString();
      console.log("minted tokenId: ", tokenId);
      // Upload the token image to CouchDB
      console.log("uploading image to couchdb")
      let tokenURI = await contract.uri(tokenId);
      console.log("tokenURI: ", tokenURI);
      const imageFile = data.uploadImage[0];
      // baseURL is the URL of the CouchDB instance, i.e. the tokenURI without the token id
      const baseURL = tokenURI.substring(0, tokenURI.lastIndexOf('/') + 1);
      let imageURL = await uploadImageToCouchDB(imageFile, baseURL);
      console.log("imageURL: ", imageURL);
      // Create a JSON document with the form data and the URL of the uploaded image
      let JSONBody = {
        ...data,
        imageURL: imageURL,
        tokenId: tokenId
      };
      console.log("JSONBody: ", JSONBody);
      let jsonURI = await uploadJSONToCouchDB(tokenURI, JSONBody);
      console.log("jsonURI: ", jsonURI);
      alert("Order successfully minted. Your token id is: " + tokenId);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  useEffect(() => {
    console.log("connected address: ", address);
  }, [address]);

  return (
    <div className="flex flex-col place-items-center mt-10" id="nftForm">
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
      <h3 className="text-center font-bold text-purple-500 mb-8">
        Upload the concert data to the marketplace
      </h3>
      {formSchema.map((field, index) => (
        <div key={index} className="mb-4">
          <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor={field.name}>
            {field.title}
          </label>
          <input
            {...register(field.name)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type={field.type}
            placeholder={field.placeholder}
            id={field.name}
          />
          {errors[field.name] && <span className="text-red-500 text-xs italic">{errors[field.name].message}</span>}
        </div>
      ))}
      {address && address !== '0x' ? (
      <input
        disabled={!address || address === '0x'}
        className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg"
        id="list-button"
        value='Mint Token'
        type="submit"
      />
      ): ("Connect wallet to mint token")}

    </form>
  </div>
  );
};

export default MintOrder;
