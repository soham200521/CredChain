import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

const injected = new InjectedConnector({
  supportedChainIds: [1, 11155111],
});

export default function WalletConnector({ onConnect }) {
  const { activate } = useWeb3React();

  const handleConnect = async () => {
    try {
      await activate(injected);
      onConnect?.();
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  return (
    <button 
      onClick={handleConnect}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Connect Wallet
    </button>
  );
}
