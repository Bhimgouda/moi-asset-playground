import React, { useState } from "react";
import { VoyageProvider, Wallet } from "js-moi-sdk";
import Navbar from "./components/Navbar";
import AssetFactory from "./pages/AssetFactory";
import AssetManager from "./pages/AssetManager";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import ConnectModal from "./components/ConnectModal";
import "./styles/App.css";

const provider = new VoyageProvider("babylon");

function App() {
  const [wallet, setWallet] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateWallet = (wallet) => {
    setWallet(wallet);
  };
  const showConnectModal = (value) => {
    setIsModalOpen(value);
  };

  return (
    <div className="app">
      <Toaster />
      <Navbar wallet={wallet} updateWallet={updateWallet} showConnectModal={showConnectModal} />
      <ConnectModal
        isModalOpen={isModalOpen}
        showConnectModal={showConnectModal}
        updateWallet={updateWallet}
        provider={provider}
      />
      <Routes>
        <Route
          path={"create-asset"}
          element={<AssetFactory wallet={wallet} showConnectModal={showConnectModal} />}
        />
        <Route
          path={"transfer-asset"}
          element={<AssetManager wallet={wallet} showConnectModal={showConnectModal} />}
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
