// MyNFTs.js
import withTokenFetcher from "./withTokenFetcher";
import React, { useContext } from 'react';
import { EthereumContext } from './EthereumProvider';
import { NetworkError, NoAccountError } from './ErrorMessages';

const fetchFunction = (address, contract) => {
  if (!address || address === "0x" || !contract) {
    // return a "dummy" function if the address or contract are not available
    return () => Promise.resolve([]);
  }
  return contract.getNonFungibleTokensByOwner({ from: address });
};

const displayProperties = ["artistName", "concertDescription", "price"];
const MyNFTsComponent = withTokenFetcher(fetchFunction, displayProperties);

const MyNFTs = () => {
  const { address, network } = useContext(EthereumContext);
  if (!network || network.chainId !== 1337) {
    return (
      <NetworkError />
    );
  }
  
  if (!address || address === "0x") {
    return (
      <NoAccountError />
    );
  }
  return <MyNFTsComponent />;
};

export default MyNFTs;
