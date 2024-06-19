import React from "react";
import { Link, useLocation } from "react-router-dom";
import truncateStr from "../utils/truncateStr";

const Navbar = ({ wallet, updateWallet, showConnectModal }) => {
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
      </div>
      <div>
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
