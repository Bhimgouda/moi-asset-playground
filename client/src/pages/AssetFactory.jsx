import React, { useState } from "react";
import Loader from "../components/Loader";
import { toastError, toastInfo, toastSuccess } from "../utils/toastWrapper";
import network from "../interface/network";
import Background from "../components/Background";
import Popup from "../components/Popup";

const AssetFactory = ({ wallet, showConnectModal, updateWalletBalance }) => {
  const [interacting, setInteracting] = useState(false); // For Loader
  const [ixReceipt, setIxReceipt] = useState(); // For Result
  const [popup, setPopup] = useState(false);

  // User Inputs
  const [assetStandard, setAssetStandard] = useState("MAS0");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");

  const createAsset = async () => {
    try {
      // Checks
      if (!wallet) return showConnectModal(true);
      if (!symbol) return toastError("Please enter the Symbol");
      if (assetStandard === "MAS0" && !supply) return toastError("Please enter the Supply");

      setInteracting(true);

      // Network Interaction
      const ixReceipt = await network.CreateAsset(wallet, assetStandard, symbol, supply);

      setInteracting(false);
      setIxReceipt(ixReceipt);
      setPopup(true);

      // Reset
      setSupply("");
      setSymbol("");
      updateWalletBalance();
    } catch (error) {
      error.message === "insufficient funds"
        ? toastError("Insufficient funds for fuel")
        : toastError(error.message);

      setInteracting(false);
      updateWalletBalance();
    }
  };

  const closePopup = () => {
    setIxReceipt();
    setPopup(false);
  };

  return (
    <div className="section">
      {popup && <Popup closePopup={closePopup} ixReceipt={ixReceipt} />}
      <Background assetStandard={assetStandard} />
      <div className="input-area">
        <div className="select-wrapper">
          <select
            value={assetStandard}
            className="input-area__box"
            onChange={(e) => setAssetStandard(e.target.value)}
            name="assetStandard"
            id="assetStandard"
          >
            <option value="MAS0">MAS0 - Fungible Asset</option>
            <option value="MAS1">MAS1 - Non-fungible Asset {`(NFT)`}</option>
          </select>
        </div>
        <div className="input-area__box">
          <label htmlFor="symbol">Symbol</label>
          <input
            value={symbol}
            className=""
            onChange={(e) => setSymbol(e.target.value)}
            type="text"
            name="symbol"
            id="symbol"
            placeholder={`eg: ${assetStandard === "MAS0" ? "MANA Token" : "BORED APE"}`}
          />
        </div>
        <div className="input-area__box">
          <label htmlFor="supply">Supply</label>
          <input
            value={assetStandard === "MAS1" ? 1 : supply}
            disabled={assetStandard === "MAS1"}
            onChange={(e) => setSupply(e.target.value)}
            type="text"
            id="supply"
            name="supply"
            placeholder="1000000"
          />
        </div>
        <button
          className="btn btn--moi"
          onClick={createAsset}
          // disabled={interacting || !supply || !symbol}
        >
          {!interacting ? (
            <span>CREATE {assetStandard === "MAS0" ? "TOKEN" : "NFT"}</span>
          ) : (
            <Loader color={"#ffffe6"} size={10} loading={interacting} />
          )}
        </button>
      </div>
    </div>
  );
};

export default AssetFactory;
