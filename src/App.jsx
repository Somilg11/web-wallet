import { useState } from "react";
import Navbar from "./components/Navbar";
import WalletCompo from "./components/WalletCompo";
import { ArrowLeft } from "lucide-react";
import Footer from "./components/Footer";
import { Buffer } from "buffer";

// Make Buffer globally available
window.Buffer = Buffer;

const App = () => {
  const [selectedWallet, setSelectedWallet] = useState(""); // Tracks whether ETH or SOL is selected

  return (
    <div className="bg-black text-white px-5 sm:px-14">
      <Navbar />
      {/* <p className="text-2xl mb-5">Create a Crypto Wallet</p> */}

      <div className="min-h-screen">

      {!selectedWallet ? (
        <div className="flex flex-col gap-5">
          <p className="text-lg">Choose a blockchain to create a wallet:</p>
          <div className="flex gap-5">
          <button
            onClick={() => setSelectedWallet("Ethereum")}
            className="bg-white text-black py-2 px-4 rounded font-semibold"
          >
            Ethereum Wallet
          </button>
          <button
            onClick={() => setSelectedWallet("Solana")}
            className="bg-white text-black py-2 px-4 rounded font-semibold"
          >
            Solana Wallet
          </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-lg mb-3">
            Creating a {selectedWallet} Wallet
          </p>
          <button
            onClick={() => setSelectedWallet("")}
            className="bg-zinc-900 text-white p-2 rounded-full mb-1"
          >
            <ArrowLeft />
          </button>
          <WalletCompo walletType={selectedWallet} />
        </div>
      )}

      </div>

      <Footer/>
    </div>
  );
};

export default App;
