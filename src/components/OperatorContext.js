import { createContext, useContext, useEffect, useState } from 'react';
import { EthereumContext } from './EthereumProvider';

export const OperatorContext = createContext();

export const OperatorProvider = ({ children }) => {
  const { readContract, address } = useContext(EthereumContext);
  const [isOperator, setIsOperator] = useState(false);

  useEffect(() => {
    const fetchOwner = async () => {
      const ownerAddress = await readContract.owner();
      setIsOperator(ownerAddress.toLowerCase() === address.toLowerCase());
    }

    if (readContract && address) {
      fetchOwner();
    }
  }, [readContract, address]);

  return (
    <OperatorContext.Provider value={{ isOperator }}>
      {children}
    </OperatorContext.Provider>
  );
};
