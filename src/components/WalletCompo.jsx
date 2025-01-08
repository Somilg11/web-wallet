/* eslint-disable react/prop-types */
import { useState } from "react";
import { generateMnemonic } from "bip39";
import { SolanaWallet } from "./SolanaWallet";
import { EthWallet } from "./EthWallet";
import { Clipboard, Eye, EyeOff } from "lucide-react";

const WalletCompo = ({ walletType }) => {
  const [mnemonic, setMnemonic] = useState("");
  const [showMnemonic, setShowMnemonic] = useState(false); // State to toggle visibility

  // Function to copy the seed phrase
  const copyToClipboard = () => {
    navigator.clipboard.writeText(mnemonic);
    alert("Seed phrase copied to clipboard!");
  };

  return (
    <div className="mt-3">
      <div className="flex flex-col flex-wrap">
        {!mnemonic ? (
          <button
            onClick={async function () {
              const mn = generateMnemonic();
              setMnemonic(mn);
              setShowMnemonic(false); // Hide mnemonic by default after generating
            }}
            className="bg-white text-black w-44 font-medium px-3 py-2 rounded"
          >
            Create Seed Phrase
          </button>
        ) : (
          <>
            <div className="flex items-center mb-3">
              <input
                className="bg-zinc-900 outline-none px-3 py-2 w-full rounded mr-2"
                type={showMnemonic ? "text" : "password"} // Toggle visibility
                value={mnemonic}
                readOnly
              />
              <button
                onClick={() => setShowMnemonic(!showMnemonic)}
                className="bg-zinc-900 text-white px-3 py-2 rounded ml-2"
              >
                {showMnemonic ? <Eye /> : <EyeOff />}
              </button>
              <button
                onClick={copyToClipboard}
                className="bg-zinc-900 text-white px-3 py-2 rounded ml-2"
              >
                <Clipboard />
              </button>
            </div>
          </>
        )}
      </div>
      <div>
        {mnemonic && walletType === "Solana" && (
          <SolanaWallet mnemonic={mnemonic} />
        )}
        {mnemonic && walletType === "Ethereum" && (
          <EthWallet mnemonic={mnemonic} />
        )}
      </div>
    </div>
  );
};

export default WalletCompo;
