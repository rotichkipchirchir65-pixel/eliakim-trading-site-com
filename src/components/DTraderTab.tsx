import { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  Tv, 
  Percent, 
  HelpCircle, 
  Play, 
  Sliders, 
  ChevronUp, 
  TrendingDown, 
  Activity,
  Award
} from 'lucide-react';

interface DTraderProps {
  addLog: (msg: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  addTransaction: (tx: any) => void;
  isLiveConnected: boolean;
  executeDerivTrade: (market: string, contractType: string, stake: number, duration: number, durationUnit: string) => boolean;
  lastTickBySymbol: Record<string, { quote: number; symbol: string; lastDigit: number; epoch: number }>;
}

export default function DTraderTab({ 
  addLog, 
  addTransaction,
  isLiveConnected,
  executeDerivTrade,
  lastTickBySymbol
}: DTraderProps) {
  const [accumulatorRate, setAccumulatorRate] = useState('1%');
  const [stakeAmount, setStakeAmount] = useState(1.0);
  const [takeProfit, setTakeProfit] = useState(true);
  const [takeProfitValue, setTakeProfitValue] = useState(10.0);
  const [chartData, setChartData] = useState<number[]>([100, 102, 101, 104, 103, 106, 105, 109, 107, 111, 110, 114, 113, 115, 114, 118, 117, 120, 119, 122]);
  const [livePrice, setLivePrice] = useState(122.45);
  const [multiplier, setMultiplier] = useState(1.0);
  const [isContractActive, setIsContractActive] = useState(false);

  // Bind chart data and pricing directly into live streamed ticks for R_100
  useEffect(() => {
    const activeTick = lastTickBySymbol['R_100'];
    if (!activeTick) return;

    const nextPrice = Number(activeTick.quote.toFixed(2));
    setLivePrice(nextPrice);
    
    setChartData((prev) => {
      const sliced = prev.length >= 25 ? prev.slice(1) : prev;
      return [...sliced, nextPrice];
    });

    // Growth multiplier simulation only active if they has connection
    if (isContractActive && !isLiveConnected) {
      setMultiplier((prev) => {
        const rateVal = parseFloat(accumulatorRate) / 100;
        const nextMult = prev + (prev * rateVal) + (Math.random() * 0.02);
        
        if (nextMult >= 3.0) {
          handleContractOutcome(true, nextMult);
        } else if (Math.random() > 0.88) { // crash risk
          handleContractOutcome(false, nextMult);
        }
        
        return parseFloat(nextMult.toFixed(4));
      });
    }
  }, [lastTickBySymbol['R_100'], isContractActive, accumulatorRate, isLiveConnected]);

  const handleContractOutcome = (success: boolean, finalMult: number) => {
    setIsContractActive(false);
    
    setTimeout(() => {
      const stakeVal = stakeAmount;
      const profit = success ? (stakeVal * finalMult) - stakeVal : -stakeVal;
      const payout = success ? stakeVal * finalMult : 0;

      addLog(success 
        ? `[DTrader Accumulators] Target achieved! Multiplier reached x${finalMult.toFixed(2)}. Contract closed.` 
        : `[DTrader Accumulators] Accumulator crashed. Contract expired. Final multiplier x${finalMult.toFixed(2)}.`, 
        success ? 'success' : 'error'
      );

      const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });
      addTransaction({
        id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
        time: nowStr,
        type: 'Buy',
        market: 'Volatility 100 Index (DTrader)',
        stake: stakeVal,
        payout: parseFloat(payout.toFixed(2)),
        profit: parseFloat(profit.toFixed(2)),
        status: success ? 'won' : 'lost',
        contractType: 'Accumulator ' + accumulatorRate,
        exitTick: livePrice
      });

      setMultiplier(1.0);
    }, 100);
  };

  const handleBuyClick = () => {
    if (!isLiveConnected) {
      addLog("Live Account Integration Required! Connect your real or virtual Deriv account in the header first.", "error");
      return;
    }

    addLog(`[DTrader Live Engine] Constructing new Rise options order on Volatility 100 Index. Stake: $${stakeAmount} USD...`, "info");
    const sent = executeDerivTrade(
      'Volatility 100 Index',
      'Rise',
      stakeAmount,
      5,
      't'
    );
    if (sent) {
      addLog("[DTrader Live Engine] Order successfully transmitted. Follow resolution updates inside the transaction ledger.", "success");
    }
  };

  // Convert chartData coordinates into SVG chart line path bounds
  const minVal = Math.min(...chartData) - 1;
  const maxVal = Math.max(...chartData) + 1;
  const range = maxVal - minVal || 1;
  const svgWidth = 500;
  const svgHeight = 150;

  const pointsPath = chartData.map((val, idx) => {
    const x = (idx / (chartData.length - 1)) * svgWidth;
    const y = svgHeight - (((val - minVal) / range) * svgHeight);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-120px)] p-6 text-gray-800 font-sans select-none" id="dtrader-panel">
      
      {!isLiveConnected && (
        <div className="max-w-6xl mx-auto bg-amber-50 border border-amber-250 p-4 rounded-2xl text-xs text-amber-950 flex items-start gap-3 mb-6">
          <Activity className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0 animate-pulse" />
          <div>
            <p className="font-bold">Live Deriv Market Mode Locked</p>
            <p className="mt-1 font-medium leading-relaxed">
              Positions taken inside the DTrader layout execute directly on Deriv's live pricing servers. Please authenticate your account using the <strong>Log in</strong> option in the header above to unlock live trade execution. Offline local simulation matches have been deactivated.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6" id="dtrader-view-grid">
        
        {/* Graph and analytics pane */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            {/* Header info */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Tv className="w-5 h-5 text-teal-600 animate-pulse" />
                <span className="font-bold text-sm tracking-tight text-gray-800">Volatility 100 Index Accumulants Chart</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-emerald-600 font-bold text-sm">{livePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Simulated Live Vector SVG Line Graph */}
            <div className="bg-slate-900 border border-slate-950 p-4 rounded-2xl relative select-none" id="dtrader-vector-coordinate-canvas">
              <svg 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                className="w-full h-44 transition-all duration-300"
              >
                {/* Horizontal grid lines */}
                <line x1="0" y1="37" x2={svgWidth} y2="37" stroke="#ffffff08" strokeWidth="1" />
                <line x1="0" y1="75" x2={svgWidth} y2="75" stroke="#ffffff08" strokeWidth="1" />
                <line x1="0" y1="112" x2={svgWidth} y2="112" stroke="#ffffff08" strokeWidth="1" />

                {/* Shaded Area under path */}
                <path
                  d={`M0,${svgHeight} L${pointsPath} L${svgWidth},${svgHeight} Z`}
                  fill="url(#grad)"
                  opacity="0.15"
                  className="transition-all duration-300"
                />

                {/* Dynamic SVG Sparklines coordinate path */}
                <polyline
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="2.5"
                  points={pointsPath}
                  className="transition-all duration-300"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Active vector pulsating coordinate dot */}
                {chartData.length > 0 && (
                  <circle
                    cx={svgWidth}
                    cy={svgHeight - (((chartData[chartData.length - 1] - minVal) / range) * svgHeight)}
                    r="5"
                    fill="#14b8a6"
                    className="animate-ping"
                  />
                )}

                {/* Definitions for gradient backgrounds */}
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Floating ticker parameters overlay */}
              <div className="absolute top-6 left-6 flex bg-[#1e293b]/75 border border-slate-800 rounded px-2.5 py-1.5 gap-3.5 text-slate-400 font-mono text-[10px] select-none">
                <div>
                  <span className="block uppercase text-[8px] text-gray-500 font-bold leading-none">Min limit:</span>
                  <span className="text-slate-200 mt-1 block font-black">{minVal.toFixed(2)}</span>
                </div>
                <div className="border-l border-slate-800 pl-3.5">
                  <span className="block uppercase text-[8px] text-gray-500 font-bold leading-none">Max limit:</span>
                  <span className="text-slate-200 mt-1 block font-black">{maxVal.toFixed(2)}</span>
                </div>
                <div className="border-l border-slate-800 pl-3.5">
                  <span className="block uppercase text-[8px] text-gray-500 font-bold leading-none">Coordinates:</span>
                  <span className="text-teal-400 mt-1 block font-black">{chartData.length} pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines info */}
          <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl text-xs text-slate-500 mt-6 select-text flex gap-2">
            <Activity className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Accumulator Guidelines:</strong> Profits continue to compound by the specified rate at every tick. Resell at any time before the option crashes to secure accumulated multiplier returns!
            </span>
          </div>
        </div>

        {/* Right buy/settings controls panel */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">Contract Parameters</h3>

            {/* Growth rate selectors (Accumulator rate) */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Accumulator Growth Rate:</span>
              <div className="grid grid-cols-5 gap-1.5 p-0.5 bg-gray-100 border border-gray-200 rounded-lg">
                {['1%', '2%', '3%', '4%', '5%'].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setAccumulatorRate(rate)}
                    disabled={isContractActive}
                    className={`py-1.5 rounded text-xs font-bold transition-all ${
                      accumulatorRate === rate 
                        ? 'bg-[#14b8a6] text-white shadow' 
                        : 'text-gray-500 hover:text-gray-800 disabled:opacity-40 cursor-pointer'
                    }`}
                  >
                    {rate}
                  </button>
                ))}
              </div>
            </div>

            {/* Stake Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Stake USD:</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-2.5 justify-between">
                <span className="text-xs font-mono font-bold text-gray-400">USD</span>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  disabled={isContractActive}
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(Math.max(0.1, Number(e.target.value)))}
                  className="bg-transparent font-mono font-black text-right border-none h-auto p-0 focus:outline-none w-full text-sm text-gray-800 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Compound safety toggle take profit */}
            <div className="border border-gray-150 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between select-none">
                <label htmlFor="tp-switch" className="text-xs font-bold text-gray-700 cursor-pointer">Take Profit Safety Limit</label>
                <input
                  type="checkbox"
                  id="tp-switch"
                  checked={takeProfit}
                  disabled={isContractActive}
                  onChange={(e) => setTakeProfit(e.target.checked)}
                  className="rounded text-teal-600 border-gray-300 focus:ring-0 cursor-pointer"
                />
              </div>

              {takeProfit && (
                <div className="flex items-center bg-white border border-gray-200 p-2 rounded-lg gap-2 justify-between">
                  <span className="text-[10px] text-gray-400 font-mono tracking-wide uppercase">Close Profit multiplier:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-emerald-500">x</span>
                    <input
                      type="number"
                      step="0.1"
                      min="1.1"
                      value={takeProfitValue}
                      disabled={isContractActive}
                      onChange={(e) => setTakeProfitValue(Math.max(1.1, Number(e.target.value)))}
                      className="bg-transparent font-mono font-bold w-12 text-center text-xs focus:outline-none p-0 border-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Active compounds ticker state */}
            {isContractActive && (
              <div className="bg-teal-50 border border-teal-100 p-4 rounded-2xl flex flex-col items-center">
                <span className="text-[10px] text-teal-600 uppercase tracking-widest font-bold">Compound multiplier status</span>
                <span className="text-2xl font-mono font-extrabold text-teal-700 mt-1 animate-pulse leading-none">
                  x{multiplier.toFixed(4)}
                </span>
                <span className="text-[11px] text-teal-600 font-semibold mt-2 font-mono">
                  Current Payout: ${(stakeAmount * multiplier).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Buy Contract Button */}
          <div className="pt-6 border-t border-gray-100 mt-6 select-none">
            <button
              onClick={handleBuyClick}
              className={`w-full py-4 rounded-2xl text-white text-xs font-black uppercase shadow hover:scale-[1.01] active:scale-95 transition-all cursor-pointer ${
                isContractActive 
                  ? 'bg-rose-500 hover:bg-rose-600' 
                  : 'bg-teal-500 hover:bg-teal-600'
              }`}
            >
              {isContractActive ? (
                <span>Close Position - Securing x{multiplier.toFixed(2)}</span>
              ) : (
                <span>Purchase Accumulator Contract</span>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
