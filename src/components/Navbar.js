import React, { useContext } from 'react';
import { EthereumContext } from './EthereumProvider';
import { Link, useLocation } from 'react-router-dom';
import fullLogo from '../assets/houseofmusic.png';

const NavBar = () => {
  const { address, connectWebsite } = useContext(EthereumContext);
  const location = useLocation();

  const formatAddress = (address) => {
    return address.substring(0, 6) + '...' + address.substring(38);
  };

  const navItems = [
    { path: '/', label: 'Marketplace' },
    { path: '/mynfts', label: 'My NFTs'},
    { path: '/operatorconsole', label: 'Operator Console'}
  ];


return (
  <div className="">
    <nav className="w-screen">
      <ul className='flex items-end justify-between py-3 bg-transparent text-white pr-5'>
        <li className='flex items-end ml-5 pb-2'>
          <Link to="/">
            <img src={fullLogo} alt="" width={120} height={120} className="inline-block -mt-2"/>
            <div className='inline-block font-bold text-xl ml-2'>
              House of Music
            </div>
          </Link>
        </li>
        <li className='w-4/6'>
          <ul className='lg:flex justify-between font-bold mr-10 text-lg'>
            {navItems.map(({ path, label }, index) => (
              <li key={index} className={location.pathname === path ? 'border-b-2 hover:pb-0 p-2' : 'hover:border-b-2 hover:pb-0 p-2'}>
                <Link to={path}>{label}</Link>
              </li>
            ))}
            <li>
              <button 
                className={`enableEthereumButton font-bold py-2 px-4 rounded text-sm ${address !== '0x' ? "bg-blue-500 hover:bg-blue-700" : "bg-green-500 hover:bg-green-700"}`} 
                onClick={connectWebsite}
              >
                  {address !== '0x' ? 'Address: '+formatAddress(address) : 'Connect Wallet'}
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
 );
}

export default NavBar;