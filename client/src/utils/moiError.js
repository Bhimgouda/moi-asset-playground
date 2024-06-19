import { toastError } from "./toastWrapper";

export const moiError = (error) => {
  if (error.message === "insufficient funds") {
    toastError("Insufficient funds for fuel");
  } else if (error.message.includes("account not found")) {
    toastError("Please claim faucet Tokens to get started");
  } else {
    toastError(error.message);
  }
};
