// withTokenFetcher.js
import React, { useCallback, useContext } from "react";
import useTokenFetcher from "./useTokenFetcher";
import { EthereumContext } from "./EthereumProvider";
import TokenList from "./TokenList";

const withTokenFetcher = (
  fetchFunction,
  displayProperties,
  tokenType = null
) => {
  return () => {
    const { address, error } = useContext(EthereumContext);
    // console.log("withTokenFetcher => fetchFunction: ", fetchFunction.toString(), " address: ", address)

    const tokenFetcher = useCallback((contract) => fetchFunction(address, contract), [address]);

    const {
      tokens,
      isLoading,
      error: fetchError,
    } = useTokenFetcher(tokenFetcher);

    // if EthereumProvider returns an error or if the fetch fails, display an error message
    if (error || fetchError) {
      return (
        <div className="text-xl ml-20 space-y-8 text-black shadow-2xl rounded-lg border-2 p-5">
          {error && <div>Error: {error}</div>}
          {fetchError && <div>Error: {fetchError}</div>}
        </div>
      );
    }

    return (
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <TokenList
            tokens={tokens}
            displayProperties={displayProperties}
            tokenType={tokenType}
          />
        )}
      </div>
    );
  };
};

export default withTokenFetcher;
