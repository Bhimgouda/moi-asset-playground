import { IxType, VoyageProvider } from "js-moi-sdk";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import truncateStr from "../utils/truncateStr";
import { toastError, toastInfo, toastSuccess } from "../utils/toastWrapper";
import network from "../interface/network";
import bg from "../styles/bg.module.css";
import sendImage from "../assets/images/send.png";
import Popup from "../components/Popup";
import { ScaleLoader } from "react-spinners";

const AssetManager = ({ wallet, showConnectModal }) => {
  const [assets, setAssets] = useState(undefined); // All user assets
  const [interacting, setInteracting] = useState(false); // For loader
  const [ixReceipt, setIxReceipt] = useState(); // For Result
  const [popup, setPopup] = useState(false);

  const [receiver, setReceiver] = useState("");
  const [assetId, setAssetId] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!wallet) {
      return setAssets(undefined);
    }

    getAssets(wallet.getAddress());
  }, [wallet]);

  const getAssets = async (address) => {
    let tdu = await network.GetUsersAsset(address);
    const info = await Promise.all(tdu.map((tdu) => network.GetAssetInfo(tdu.asset_id)));
    const assetData = tdu.map((tdu, index) => {
      return { ...tdu, ...info[index] };
    });
    setAssets(assetData);
  };

  const transferAsset = async () => {
    try {
      // Checks
      if (!wallet) return showConnectModal(true);
      if (!receiver) return toastError("Please enter the Receiver address");
      if (!assetId) return toastError("Please select the AssetId");
      if (!amount) return toastError("Please select the Amount");
      setInteracting(true);

      const ixReceipt = await network.TransferAsset(wallet, receiver, assetId, amount);

      setInteracting(false);
      setIxReceipt(ixReceipt);
      setPopup(true);

      // Reset
      setReceiver("");
      setAssetId("");
      setAmount("");
      await getAssets(wallet.getAddress());
    } catch (error) {
      toast.error(error.message);
      setInteracting(false);
    }
  };

  const closePopup = () => {
    setIxReceipt();
    setPopup(false);
  };

  return (
    <div className="section">
      {popup && <Popup closePopup={closePopup} ixReceipt={ixReceipt} />}
      <div className={bg.blurToken}></div>
      <img src={sendImage} className={bg.send} alt="" />
      <div className="input-area">
        <div className="input-area__box">
          <label htmlFor="sender">Sender Address</label>
          <input
            placeholder="Connect your wallet"
            disabled
            value={truncateStr(wallet?.getAddress(), 21)}
            name="sender"
            id="sender"
          />
        </div>
        <div className="input-area__box">
          <label htmlFor="receiver">Receiver Address</label>
          <input
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            id="receiver"
            name="receiver"
            placeholder="0x..."
          />
        </div>
        <div className="input-area__box">
          <label htmlFor="assetId">Select Asset Id</label>
          {wallet ? (
            assets ? (
              <select
                value={assetId}
                className="input-area__box"
                style={{ padding: "0" }}
                onChange={(e) => setAssetId(e.target.value)}
                name="assetId"
                id="assetId"
              >
                <option value=""></option>
                {assets?.map((asset, index) => (
                  <option key={index} value={asset.asset_id}>
                    {`${truncateStr(asset.asset_id, 12)} ${
                      asset.symbol && `(${asset.symbol})`
                    } - Bal: ${asset.amount}`}
                  </option>
                ))}
              </select>
            ) : (
              <ScaleLoader color="#9b9b9b" height="18px" />
            )
          ) : (
            <select
              value={assetId}
              className="input-area__box"
              style={{ padding: "0" }}
              onChange={(e) => setAssetId(e.target.value)}
              name="assetId"
              id="assetId"
            >
              <option value=""></option>
            </select>
          )}
        </div>
        <div className="input-area__box">
          <label htmlFor="amount">Amount</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            id="amount"
            name="amount"
            placeholder="100"
          />
        </div>
        <button
          className="btn btn--moi"
          onClick={transferAsset}
          // disabled={interacting || !receiver || !amount || !assetId}
        >
          {!interacting ? (
            <span>TRANSFER ASSET</span>
          ) : (
            <Loader color={"#ffffe6"} size={10} loading={interacting} />
          )}
        </button>
      </div>
    </div>
  );
};

export default AssetManager;
