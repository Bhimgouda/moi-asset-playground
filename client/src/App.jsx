import React, { useEffect, useState } from "react";
import { VoyageProvider, Wallet } from "js-moi-sdk";
import Navbar from "./components/Navbar";
import AssetFactory from "./pages/AssetFactory";
import AssetManager from "./pages/AssetManager";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import ConnectModal from "./components/ConnectModal";
import "./styles/App.css";
import network from "./interface/network";

const provider = new VoyageProvider("babylon");

function App() {
  const [wallet, setWallet] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState("");

  const updateWallet = (wallet) => {
    setWallet(wallet);
  };
  const showConnectModal = (value) => {
    setIsModalOpen(value);
  };

  useEffect(() => {
    if (!wallet) return;

    updateWalletBalance();
  }, [wallet]);

  const updateWalletBalance = async () => {
    const balance = await network.GetKmoiBalance(wallet.address);
    setWalletBalance(balance);
  };

  return (
    <div className="app">
      <Toaster />
      <Navbar
        walletBalance={walletBalance}
        wallet={wallet}
        updateWallet={updateWallet}
        showConnectModal={showConnectModal}
      />
      <ConnectModal
        isModalOpen={isModalOpen}
        showConnectModal={showConnectModal}
        updateWallet={updateWallet}
        provider={provider}
      />
      <Routes>
        <Route
          path={"create-asset"}
          element={
            <AssetFactory
              updateWalletBalance={updateWalletBalance}
              wallet={wallet}
              showConnectModal={showConnectModal}
            />
          }
        />
        <Route
          path={"transfer-asset"}
          element={
            <AssetManager
              updateWalletBalance={updateWalletBalance}
              wallet={wallet}
              showConnectModal={showConnectModal}
            />
          }
        />
        <Route
          path="*" // Redirect to
          element={<Navigate to="/create-asset" />}
        />
      </Routes>
    </div>
  );
}

export default App;
