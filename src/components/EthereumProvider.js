import React, { useState, useEffect, createContext, useCallback } from 'react';
import { ethers } from 'ethers';
import MarketplaceJSON from '../Marketplace.json';

export const EthereumContext = createContext();

export const EthereumProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [readContract, setReadContract] = useState(null);
  const [writeContract, setWriteContract] = useState(null);
  const [address, setAddress] = useState('0x');
  const [network, setNetwork] = useState(null);
  const [error, setError] = useState(null);

  const updateConnection = useCallback(async () => {
    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(newProvider);

    const newNetwork = await newProvider.getNetwork();
    setNetwork(newNetwork);

    // Init read contract with the provider
    const newReadContract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, newProvider);
    setReadContract(newReadContract);

    if (window.ethereum.selectedAddress) {
      const newSigner = newProvider.getSigner();
      const newAddress = await newSigner.getAddress();

      // Init write contract with the signer
      const newWriteContract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, newSigner);

      setSigner(newSigner);
      setAddress(newAddress);
      setWriteContract(newWriteContract);
      setError(null);
    } else {
      setSigner(null);
      setAddress('0x');
      setWriteContract(null);
      setError(null);
    }

    if (newNetwork.chainId !== 1337) {
      setError("Please switch to Ganache network");
      setNetwork(null);
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      updateConnection();
      window.ethereum.on('accountsChanged', updateConnection);
      window.ethereum.on('chainChanged', updateConnection);

      return () => {
        window.ethereum.removeListener('accountsChanged', updateConnection);
        window.ethereum.removeListener('chainChanged', updateConnection);
      };
    }
  }, [updateConnection]);

  // connects the App to Ganache blockchain by requesting access to the user's wallet
  const connectWebsite = useCallback(async () => {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if(chainId !== '0x539') {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x539' }],
      });
    }

    // request user to connect an account from Metamask
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    // set the provider, signer, address, and write contract
    updateConnection();
  }, [updateConnection]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setSigner(null);
    setAddress('0x');
    setWriteContract(null);
    setError(null);
  }, []);

  return (
    <EthereumContext.Provider value={{ readContract, writeContract, address, connectWebsite, disconnectWallet, network, error }}>
      {children}
    </EthereumContext.Provider>
  );
};
