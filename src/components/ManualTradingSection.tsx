import { useState } from 'react';
import { Hand, AlertTriangle } from 'lucide-react';

interface ManualTradingSectionProps {
  addLog: (msg: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  addTransaction: (tx: any) => void;
  isLiveConnected: boolean;
  executeDerivTrade: (market: string, contractType: string, stake: number, duration: number, durationUnit: string) => boolean;
}

export default function ManualTradingSection({
  addLog,
  addTransaction,
  isLiveConnected,
  executeDerivTrade
}: ManualTradingSectionProps) {
  const [market, setMarket] = useState('Volatility 100 Index');
  const [stake, setStake] = useState(1.0);
  const [duration, setDuration] = useState(5);
  const [contractType, setContractType] = useState('Even');

  const handleManualPurchase = () => {
    if (!isLiveConnected) {
      addLog("Live Account Offline! Please log into your Deriv account in the header first to trade real markets.", "error");
      return;
    }

    addLog(`Initiating manual live index position on ${market} for ${duration} ticks...`, 'info');
    const success = executeDerivTrade(market, contractType, stake, duration, 't');
    if (success) {
      addLog("Contract purchased. Check the 'Reports & Logs' drawer on the right side of the screens to follow resolution streams.", "success");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-full flex items-center justify-center font-sans">
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md max-w-lg w-full">
        <div className="flex items-center gap-3 border-b border-gray-150 pb-4 mb-4 select-none">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
            <Hand className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-lg leading-normal">Manual Position Taker</h2>
            <p className="text-xs text-gray-400">Direct order execution on the actual live Deriv WebSocket exchange.</p>
          </div>
        </div>

        {!isLiveConnected && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 leading-normal mb-4 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold">Live Trading is Locked</p>
              <p className="text-amber-700 mt-1">Please log into your Deriv Account (Live or Demo) using the button in the top header to enable real market trade execution. Free local simulation matches have been deactivated to prioritize actual execution.</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5 text-xs">
            <span className="text-gray-500 font-bold">Select Index Market:</span>
            <select 
              value={market} 
              onChange={(e) => setMarket(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded p-2.5 font-bold focus:outline-none focus:bg-white text-gray-800 cursor-pointer"
            >
              <option>Volatility 100 Index</option>
              <option>Volatility 10 (1s) Index</option>
              <option>Volatility 75 Index</option>
              <option>Volatility 50 Index</option>
              <option>Volatility 25 Index</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 text-xs">
            <span className="text-gray-500 font-bold">Contract Type:</span>
            <select 
              value={contractType} 
              onChange={(e) => setContractType(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded p-2.5 font-bold focus:outline-none focus:bg-white text-gray-800 cursor-pointer"
            >
              <option value="Even">Digit Even</option>
              <option value="Odd">Digit Odd</option>
              <option value="Rise">Rise (Call)</option>
              <option value="Fall">Fall (Put)</option>
              <option value="Over">Over 4</option>
              <option value="Under">Under 5</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 text-xs">
              <span className="text-gray-500 font-bold">Stake USD:</span>
              <input 
                type="number" 
                step="0.5"
                min="0.3"
                value={stake} 
                onChange={(e) => setStake(Math.max(0.35, Number(e.target.value)))}
                className="bg-gray-50 border border-gray-200 rounded p-2 text-xs font-mono font-bold focus:outline-none focus:bg-white" 
              />
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <span className="text-gray-500 font-bold">Duration (Ticks):</span>
              <input 
                type="number" 
                min="1"
                max="10"
                value={duration} 
                onChange={(e) => setDuration(Math.max(1, Number(e.target.value)))}
                className="bg-gray-50 border border-gray-200 rounded p-2 text-xs font-mono font-bold focus:outline-none focus:bg-white" 
              />
            </div>
          </div>

          <button
            onClick={handleManualPurchase}
            disabled={!isLiveConnected}
            className={`w-full py-3 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer select-none ${
              isLiveConnected 
                ? 'bg-blue-900 hover:bg-blue-950 hover:shadow-lg' 
                : 'bg-gray-300 border-gray-250 cursor-not-allowed text-gray-500'
            }`}
          >
            {isLiveConnected ? "Execute Real Market Purchase Order" : "Account Integration Required"}
          </button>
        </div>
      </div>
    </div>
  );
}
