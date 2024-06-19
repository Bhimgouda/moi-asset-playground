import React from "react";
import { Link, useLocation } from "react-router-dom";
import truncateStr from "../utils/truncateStr";
import { formatNumber } from "../utils/formatNumber";

const Navbar = ({ wallet, updateWallet, showConnectModal, walletBalance }) => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <nav className="navbar">
      <div className="navbar__links">
        <Link to="create-asset">
          <button
            className={`navbar__link ${pathname === "/create-asset" && "navbar__link--selected"}`}
          >
            Create
          </button>
        </Link>
        <Link to="transfer-asset">
          <button
            className={`navbar__link ${pathname === "/transfer-asset" && "navbar__link--selected"}`}
          >
            Transfer
          </button>
        </Link>
        <a target="blank" href="https://voyage.moi.technology/faucet/">
          <button className={`navbar__link`}>Claim Faucet</button>
        </a>
      </div>
      <div className="navbar__links">
        {wallet && (
          <span className="navbar__balance">{`${formatNumber(walletBalance || 0)} KMOI`}</span>
        )}
        <button
          className="btn btn--connect"
          onClick={wallet ? () => updateWallet() : () => showConnectModal(true)}
        >
          {wallet ? `Disconnect: ${wallet && truncateStr(wallet.getAddress(), 11)}` : "Connect"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
