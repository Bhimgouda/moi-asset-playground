import { AssetStandard, IxType, VoyageProvider } from "js-moi-sdk";

////////////////////////
// Writes / Interactions
///////////////////////

const CreateAsset = async (wallet, assetStandard, symbol, supply) => {
  // Create Payload
  const payload = {};
  payload.standard = AssetStandard[assetStandard];
  payload.symbol = symbol;
  payload.supply = assetStandard === "MAS1" ? 1 : supply;

  const ixResponse = await wallet.sendInteraction({
    type: IxType.ASSET_CREATE,
    fuel_price: 1,
    fuel_limit: 100,
    payload,
  });

  return ixResponse.wait();
};

const TransferAsset = async (wallet, receiver, assetId, amount) => {
  const transferValues = new Map();
  transferValues.set(assetId, parseInt(amount)); // had to parseInt - workaround

  const ixResponse = await wallet.sendInteraction({
    type: IxType.VALUE_TRANSFER,
    fuel_price: 1,
    fuel_limit: 100,
    receiver,
    transfer_values: transferValues, // Only Map Type
  });

  return ixResponse.wait();
};

////////////////////////
// Reads
///////////////////////

const provider = new VoyageProvider("babylon");

const GetUsersAsset = async (address) => {
  return provider.getTDU(address);
};

const GetAssetInfo = async (asset_id) => {
  return provider.getAssetInfoByAssetID(asset_id);
};

const GetKmoiBalance = async (address) => {
  return provider.getBalance(
    address,
    "0x000000004cd973c4eb83cdb8870c0de209736270491b7acc99873da1eddced5826c3b548"
  );
};

const network = {
  CreateAsset,
  TransferAsset,
  GetAssetInfo,
  GetUsersAsset,
  GetKmoiBalance,
};

export default network;
