export const NetworkError = () => {
  return (
    <div className="profileClass" style={{ "min-height": "100vh" }}>
      <div className="flex text-center flex-col mt-11 md:text-2xl text-white">
        Connect your wallet to Ganache network
      </div>
    </div>
  );
};

export const NoAccountError = () => {
  return (
    <div className="profileClass" style={{ "minHeight": "100vh" }}>
      <div className="flex text-center flex-col mt-11 md:text-2xl text-white">
        Connect your wallet to view your NFTs
      </div>
    </div>
  );
};
