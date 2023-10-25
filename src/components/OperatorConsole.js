import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { OperatorContext } from './OperatorContext';
import { EthereumContext } from './EthereumProvider';

const OperatorConsole = () => {
  const { isOperator } = useContext(OperatorContext);
  const { address } = useContext(EthereumContext);

  if (!isOperator) {
    return( 
	<div className="profileClass" style={{"minHeight":"100vh"}}>
		<div className="flex text-center flex-col mt-11 md:text-2xl text-white">
    			<p>You are not authorized to access this page.</p>
		</div>
	</div>
    )
  }

  return (
	<div className="profileClass" style={{"minHeight":"100vh"}}>
		<div className="flex text-center flex-col mt-11 md:text-2xl text-white">
				You are logged in as operator:
         <div className='text-center bg-blue-500'>{address}</div><br/>	
    </div>
    <div className="flex h-screen bg-gray-200 mx-auto max-w-7xl">
      <div className="w-64 flex flex-col bg-white shadow-lg">
        <div className="flex items-center justify-center h-14 border-b">
          <h2 className="font-semibold text-xl">Operator Console</h2>
        </div>
        <ul className="flex-grow p-4 overflow-auto">
          <li className="mb-4 hover:bg-gray-100 rounded">
            <Link to="mint" className="block p-2 transition-colors duration-200">
              Mint New Fungible Tokens
            </Link>
          </li>
          <li className="mb-4 hover:bg-gray-100 rounded">
            <Link to="delete" className="block p-2 transition-colors duration-200">
              Delete Existing Fungible Tokens
            </Link>
          </li>
          <li className="mb-4 hover:bg-gray-100 rounded">
            <Link to="browse" className="block p-2 transition-colors duration-200">
              Browse All Existing NFTs
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex-grow bg-gray-200 p-10 overflow-auto h-full">
        {/* Here is where nested routes will appear */}
        <Outlet />
      </div>
    </div>
	</div>
  );
};

export default OperatorConsole;
