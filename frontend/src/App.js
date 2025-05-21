import React, { useState } from "react";
import { DAppKitProvider, useWallet } from "@vechain/dapp-kit-react";

function BuyCoffee() {
  const { wallet, connect } = useWallet();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const sendTip = async () => {
    if (!wallet) {
      alert("Wallet not connected.");
      return;
    }

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const methodABI = {
      constant: false,
      inputs: [
        { name: "_name", type: "string" },
        { name: "_message", type: "string" },
      ],
      name: "buyCoffee",
      outputs: [],
      payable: true,
      stateMutability: "payable",
      type: "function",
    };

    try {
      const encoded = wallet.connex.thor.abi
        .contract([methodABI])
        .methods.buyCoffee(name, message)
        .encode();

      const tx = await wallet.connex.vendor
        .sign("tx", [
          {
            to: contractAddress,
            value: "1000000000000000000", // 1 VET in wei
            data: encoded,
          },
        ])
        .request();

      console.log("Transaction sent:", tx.txID);
      alert("Coffee sent! Tx ID: " + tx.txID);
    } catch (err) {
      console.error("Transaction failed:", err);
      alert("Transaction failed.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Buy Me a Coffee ☕</h2>
      {!wallet ? (
        <button
          onClick={async () => {
            try {
              await connect();
            } catch (err) {
              console.error("Wallet connection failed:", err);
              alert("Could not connect to Sync2. Make sure it's open and on testnet.");
            }
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ margin: "0.5rem", padding: "0.5rem" }}
          />
          <input
            type="text"
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ margin: "0.5rem", padding: "0.5rem" }}
          />
          <button onClick={sendTip} style={{ margin: "0.5rem", padding: "0.5rem" }}>
            Send 1 VET
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <DAppKitProvider
      nodeUrl="https://testnet.veblocks.net"
      genesis="test"
      options={{
        walletSelect: {
          wallets: [{ name: "sync2" }],
        },
      }}
    >
      <BuyCoffee />
    </DAppKitProvider>
  );
}
