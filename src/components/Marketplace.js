// MarketPlace.js
import withTokenFetcher from "./withTokenFetcher";
import React, { useContext } from 'react';
import { EthereumContext } from './EthereumProvider';
import { NetworkError, NoAccountError } from './ErrorMessages';

const fetchFunction = (address, contract) => {
  if (!contract) {
    // return a "dummy" function if the address or contract are not available
    return () => Promise.resolve([]);
  }
  return contract.getAllFungibleTokenIDs();
};

const displayProperties = ['artistName', 'concertDescription', 'tokenPrice', 'totalSupply'];
const MarketPlaceComponent = withTokenFetcher(fetchFunction, displayProperties, "FT");

const MarketPlace = () => {
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
  return <MarketPlaceComponent />
};

export default MarketPlace;
