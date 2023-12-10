import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Wenb3Model from "web3modal";
import StakeContract from "../../../artifacts/contracts/StakeContract.sol/StakeContract.json";

const StakeContractAddress = "0xeCF14980e40f8BAf38a30558a6D26175DF1D1707";
const StakeContractABI = StakeContract.abi;

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(StakeContractAddress, StakeContractABI, signerOrProvider);

const StakeContractContext = createContext({});

export const useStake = () => useContext(StakeContractContext);

export const StakeContractContextProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");

  const connectingWithSmartContract = async () => {
    try {
      const web3Modal = new Wenb3Model();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      return contract;
    } catch (error) {
      console.log("Something went wrong while connecting with contract!");
    }
  };

  const checkIfWalletConnected = async () => {
    try {
      console.log(window.ethereum);
      if (!window.ethereum) return console.log("Install Metamask");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        console.log("Current Account", currentAccount);
      } else {
        console.log("No accounts found!");
      }
    } catch (error) {
      console.log("Something wrong while connecting to wallet");
    }
  };

  const fetchStakeAmountValue = async () => {
    try {
      const contract = await connectingWithSmartContract();
      const stakeAmount = await contract.getStakeAmountValue();
      console.log(stakeAmount.toString());
    } catch (error) {
      console.log("Something went wrong while fetching stake amount!");
    }
  };

  const addStakedAmount = async () => {
    try {
      const contract = await connectingWithSmartContract();
      const stakedAmount = await contract.addStakedAmount();
      console.log(stakedAmount.toString());
      return true;
    } catch (error) {
      console.log("Something went wrong while adding staked amount!");
      return false;
    }
  };

  const getStakeAmount = async () => {
    try {
      const contract = await connectingWithSmartContract();
      const stakeAmount = await contract.getStakeAmount();
      console.log(stakeAmount.toString());
    } catch (error) {
      console.log("Something went wrong while getting stake amount!");
    }
  };

  return (
    <StakeContractContext.Provider
      value={{
        checkIfWalletConnected,
        currentAccount,
        fetchStakeAmountValue,
        addStakedAmount,
        getStakeAmount,
      }}
    >
      {children}
    </StakeContractContext.Provider>
  );
};
