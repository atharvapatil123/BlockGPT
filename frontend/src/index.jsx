import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { StakeContractContextProvider } from "./context/StakeContractContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StakeContractContextProvider>
      <App />
    </StakeContractContextProvider>
  </React.StrictMode>
);