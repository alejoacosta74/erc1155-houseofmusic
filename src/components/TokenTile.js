// TokenTile.js
import React  from 'react';
import { Link } from 'react-router-dom';

const TokenTile = ({ token, displayProperties, tokenType }) => {
    console.log("TokenTile => token: ", token)

    const TileContent = (
        <div className="border-2 ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl">
          <img src={token.image} alt={token.metadata.orderDescription} className="w-72 h-80 rounded-lg object-cover" />
          <div className="text-white w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-50">
            <p className="display-inline">Token id: {token.id}</p>
            {
              displayProperties.map(key => (
                <p key={key} className="display-inline">{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${token.metadata[key]}`}</p>
              ))
            }
          </div>
        </div>
    );

    return tokenType === "FT" ? <Link to={`/tokenPage/${token.id}`}>{TileContent}</Link> : <>{TileContent}</>;
};

export default TokenTile;

