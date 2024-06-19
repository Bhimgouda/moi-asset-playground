import popup from "../styles/popup.module.css";
import celebrate from "../assets/images/celebrate.svg";
import error from "../assets/images/error.svg";
import link from "../assets/images/link.svg";
import close from "../assets/images/close.svg";
import { hexToBN } from "js-moi-sdk";
import truncateStr from "../utils/truncateStr";

const Popup = ({ ixReceipt, closePopup }) => {
  const voyageIxUrl = `https://voyage.moi.technology/interaction/?${ixReceipt.ix_hash}`;

  return (
    <section className={popup.overlay}>
      <div className={popup.popup}>
        {ixReceipt.ix_type === "0x3" ? (
          <>
            <h1 style={{ textAlign: "center" }}>Created Asset Succesfully</h1>
            <span>Your Asset Id: {truncateStr(ixReceipt.extra_data.asset_id, 15)}</span>
            <img className={popup.image} src={celebrate} alt="" />
            <p>Fuel Used: {hexToBN(ixReceipt.fuel_used)} KMOI</p>
          </>
        ) : (
          <>
            <h1 style={{ textAlign: "center" }}>Transferred Asset Succesfully</h1>
            <img className={popup.image} src={celebrate} alt="" />
            <p>Fuel Used: {hexToBN(ixReceipt.fuel_used)} KMOI</p>
          </>
        )}
        <a
          target="blank"
          style={{ textAlign: "center" }}
          href={voyageIxUrl}
          className="btn btn--moi"
        >
          <span>See the Interaction on Voyage</span>
          <img className={popup.iconSmall} src={link} alt="" />
        </a>
        <img
          onClick={closePopup}
          className={`${popup.iconSmall} ${popup.close}`}
          src={close}
          alt=""
        />
      </div>
    </section>
  );
};

export default Popup;
