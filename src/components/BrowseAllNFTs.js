// BrowseAllNFTs.js
import withTokenFetcher from "./withTokenFetcher";

const fetchFunction = (address, contract) => {
  if (!address || address === "0x" || !contract) {
    // return a "dummy" function if the address or contract are not available
    return () => Promise.resolve([]);
  }
  return contract.getAllNonFungibleTokens({ from: address });
};

const displayProperties = ["imsi", "operatorName", "price"];

const BrowseAllNFTsComponent = withTokenFetcher(fetchFunction, displayProperties);

const BrowseAllNFTs = () => <BrowseAllNFTsComponent />;

export default BrowseAllNFTs;