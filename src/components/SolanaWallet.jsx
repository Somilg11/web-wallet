/* eslint-disable react/prop-types */
import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Clipboard, Eye, EyeOff, Trash } from "lucide-react";
import { Buffer } from "buffer";

// Make Buffer globally available
window.Buffer = Buffer;

export function SolanaWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState([]); // Store wallets with public and private keys

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleDelete = (index) => {
    setWallets(wallets.filter((_, i) => i !== index)); // Remove wallet at the specified index
  };

  return (
    <div>
      <button
        onClick={async function () {
          try {
            const seed = await mnemonicToSeed(mnemonic); // Generate seed buffer
            const seedHex = Buffer.from(seed).toString("hex"); // Convert seed to hex
            const path = `m/44'/501'/${currentIndex}'/0'`; // Solana derivation path
            const { key: derivedSeed } = derivePath(path, seedHex); // Derive key
            if (!derivedSeed) throw new Error("Failed to derive path");
            const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey; // Generate secret key
            const keypair = Keypair.fromSecretKey(secret);

            setCurrentIndex(currentIndex + 1);
            setWallets([
              ...wallets,
              {
                publicKey: keypair.publicKey.toBase58(),
                privateKey: Buffer.from(secret).toString("hex"),
                showPrivateKey: false,
              },
            ]);
          } catch (error) {
            console.error("Error generating wallet:", error);
            alert("Failed to generate the wallet. Please check the derivation process.");
          }
        }}
        className="bg-white text-black font-medium py-2 px-3 mb-3 rounded"
      >
        Add SOL Wallet
      </button>

      {wallets.map((wallet, index) => (
        <div
          key={index}
          className="bg-zinc-900 px-3 py-2 my-2 rounded flex flex-col gap-2"
        >
          <h1 className="font-bold">Wallet {index + 1}</h1>
          <div>
            <span className="font-semibold">Public Key:</span> {wallet.publicKey}
            <button
              onClick={() => handleCopy(wallet.publicKey)}
              className="ml-2 bg-zinc-800 text-white px-2 py-1 rounded text-sm"
            >
              <Clipboard size={16} />
            </button>
          </div>
          <div>
            <span className="font-semibold">Private Key:</span>{" "}
            <span className="overflow-hidden mr-2">
              {wallet.showPrivateKey
                ? wallet.privateKey
                : "*********************************************************"}
            </span>
            <button
              onClick={() => {
                const updatedWallets = [...wallets];
                updatedWallets[index].showPrivateKey =
                  !updatedWallets[index].showPrivateKey;
                setWallets(updatedWallets);
              }}
              className="bg-zinc-800 text-white px-2 py-1 rounded text-sm"
            >
              {wallet.showPrivateKey ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button
              onClick={() => handleCopy(wallet.privateKey)}
              className="ml-2 bg-zinc-800 text-white px-2 py-1 rounded text-sm cursor-pointer"
              disabled={!wallet.showPrivateKey}
            >
              <Clipboard size={16} />
            </button>
          </div>
          <button
            onClick={() => handleDelete(index)}
            className="bg-zinc-800 text-red-500 px-3 py-2 rounded text-sm"
          >
            <span className="inline-flex gap-3 items-center">
              <Trash size={20} />
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}
