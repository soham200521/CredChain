import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

const injected = new InjectedConnector({
  supportedChainIds: [1, 11155111],
});

export default function WalletConnector({ onConnect }) {
  const { activate, account, active, deactivate } = useWeb3React();

  const handleConnect = async () => {
    try {
      await activate(injected);
      onConnect?.();
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  const handleDisconnect = () => {
    try {
      deactivate();
    } catch (err) {
      console.error("Disconnection error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {active && account ? (
        <div className="mb-4 flex flex-col items-center">
          <div className="text-green-600 font-medium mb-2">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </div>
          <button 
            onClick={handleDisconnect}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button 
          onClick={handleConnect}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
