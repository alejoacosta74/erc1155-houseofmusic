// useTokenFetcher.js
import { useState, useEffect, useContext } from "react";
import { EthereumContext } from "./EthereumProvider";
import axios from "axios";
import placeholderImageURL from "../assets/houseofmusic.png";
import placeholderMetadata from "../utils/defaultMetadata.json";

const useTokenFetcher = (tokenFetcher) => {
  const {
    readContract: contract,
    address,
    error,
  } = useContext(EthereumContext);
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true);
      setFetchError(null);
      setTokens([]);

      if (tokenFetcher.toString() !== "() => Promiseresolve([]) ") {

        if (!address) {
          setFetchError("Not connected to a wallet");
          setIsLoading(false);
          return;
        }

        if (!contract) {
          setFetchError("Not connected to the Ethereum network");
          setIsLoading(false);
          return;
        }

        try {
          console.log("useTokenFetcher => calling function: ", tokenFetcher.toString(), " address: ", address)
          const tokenIDs = await tokenFetcher(contract);
          const tokenData = await Promise.all(
            tokenIDs.map(async (id) => {
              try {
                const uri = await contract.uri(id);
                let metadata = {};
                let image = placeholderImageURL;

                try {
                  metadata = await axios.get(uri);
                  try {
                    const imageData = await axios.get(metadata.data.imageURL, {
                      responseType: "arraybuffer",
                    });
                    image = `data:${
                      metadata.data.imageMimeType
                    };base64,${Buffer.from(imageData.data, "binary").toString(
                      "base64"
                    )}`;
                  } catch (imageError) {
                    console.error(
                      `Error fetching image for token ID ${id}: `,
                      imageError
                    );
                  }
                } catch (metadataError) {
                  console.error(
                    `Error fetching metadata for token ID ${id}: `,
                    metadataError
                  );
                }

                return {
                  id: id.toString(),
                  uri,
                  metadata: metadata.data || placeholderMetadata,
                  image,
                };
              } catch (e) {
                console.error(`Error processing token ID ${id}: `, e);
              }
            })
          );
          setTokens(tokenData);
        } catch (e) {
          setFetchError(e.toString());
        } finally {
          setIsLoading(false);
        }
      } else {
      setIsLoading(false);
      }
    };

    fetchTokens();
}, [contract, address, tokenFetcher]);

  return { tokens, isLoading, error: error || fetchError };
};

export default useTokenFetcher;
