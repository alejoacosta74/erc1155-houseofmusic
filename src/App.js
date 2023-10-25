import './App.css';
import { EthereumProvider } from './components/EthereumProvider';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import MintOrder from './components/MintOrder';
import TokenPage from './components/TokenPage';
import Marketplace from './components/Marketplace';
import MyNFTs from './components/MyNFTs';
import BrowseAllNFTs from './components/BrowseAllNFTs';
import { OperatorProvider } from './components/OperatorContext';
import OperatorConsole from './components/OperatorConsole';
import BurnOrder from './components/BurnOrder';
function App() {
  return (
    <div className="container">
      <Router>
        <EthereumProvider>
          <OperatorProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Marketplace />}/>
              <Route path="/tokenPage/:tokenId" element={<TokenPage />}/>
              <Route path="/mynfts" element={<MyNFTs/>}/>
              <Route path="/operatorconsole/*" element={<OperatorConsole/>}>
                <Route path="mint" element={<MintOrder/>}/>
                <Route path="delete" element={<BurnOrder/>}/>
                <Route path="browse" element={<BrowseAllNFTs/>}/>
              </Route>
              <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
          </OperatorProvider>
        </EthereumProvider>
      </Router>
    </div>
  );
}

export default App;
