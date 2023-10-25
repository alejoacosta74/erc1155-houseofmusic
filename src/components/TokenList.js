// TokenList.js
import React from 'react';
import TokenTile from './TokenTile';

const TokenList = ({ tokens, displayProperties, tokenType }) => {
	console.log("TokenList => tokens: ", tokens)

	return (
		<div className="grid grid-cols-4 gap-3">
			{tokens.map((token) => (
				<TokenTile 
				key={token.id} 
				token={token} 
				displayProperties={displayProperties} 
				tokenType={tokenType}
				/>
			))}
		</div>
	);
};

export default TokenList;
