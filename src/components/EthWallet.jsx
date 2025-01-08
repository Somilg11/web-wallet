/* eslint-disable react/prop-types */
import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import { Clipboard, Eye, EyeOff, Trash } from "lucide-react";

export const EthWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState([]); // Store wallet objects with private keys

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
          const seed = await mnemonicToSeed(mnemonic);
          const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
          const hdNode = HDNodeWallet.fromSeed(seed);
          const child = hdNode.derivePath(derivationPath);
          const privateKey = child.privateKey;
          const wallet = new Wallet(privateKey);
          setCurrentIndex(currentIndex + 1);
          setWallets([
            ...wallets,
            { address: wallet.address, privateKey, showPrivateKey: false },
          ]);
        }}
        className="bg-white text-black font-medium py-2 px-3 rounded mb-3"
      >
        Add ETH Wallet
      </button>

      {wallets.map((wallet, index) => (
        <div
          key={index}
          className="bg-zinc-900 px-3 py-2 my-2 rounded flex flex-col gap-2"
        >
          <h1 className="font-bold">Wallet {index + 1}</h1>
          <div>
            <span className="font-semibold">Address:</span> {wallet.address}
            <button
              onClick={() => handleCopy(wallet.address)}
              className="ml-2 bg-zinc-800 text-white px-2 py-1 rounded text-sm"
            >
              <Clipboard size={16}/>
            </button>
          </div>
          <div>
            <span className="font-semibold">Private Key:</span>{" "}
            <span className="overflow-hidden mr-2">
            {wallet.showPrivateKey ? wallet.privateKey : "*********************************************************"}
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
              {wallet.showPrivateKey ? <Eye size={16}/> : <EyeOff size={16}/>}
            </button>
            <button
              onClick={() => handleCopy(wallet.privateKey)}
              className="ml-2 bg-zinc-800 text-white px-2 py-1 rounded text-sm cursor-pointer"
              disabled={!wallet.showPrivateKey}
            >
              <Clipboard size={16}/>
            </button>
          </div>
          <button
            onClick={() => handleDelete(index)}
            className="bg-zinc-800 text-red-500 px-3 py-2 rounded text-sm"
          >
            <span className="inline-flex gap-3 items-center"><Trash size={20}/></span>
          </button>
        </div>
      ))}
    </div>
  );
};
