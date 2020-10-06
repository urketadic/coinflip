import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";


const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        networkParams: {
            host: "https://localhost:8545", // optional
            chainId: 1337, // optional
            networkId: 1337 // optional
        },
        infuraId: "INFURA_ID" // required
      },
      config: {
        buildEnv: "development" // optional
      }
    }
  };

const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions,
  });

export default web3Modal;