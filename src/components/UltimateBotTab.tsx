import { useState, useEffect } from 'react';
import { 
  Play, 
  StopCircle, 
  Sliders, 
  HelpCircle, 
  ShieldAlert, 
  Flame, 
  RotateCcw,
  RefreshCw,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { BotConfig } from '../types';

interface UltimateBotProps {
  addLog: (msg: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  addTransaction: (tx: any) => void;
  botConfig: BotConfig;
  setBotConfig: (cfg: BotConfig) => void;
}

export default function UltimateBotTab({ 
  addLog, 
  addTransaction, 
  botConfig, 
  setBotConfig 
}: UltimateBotProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [runsCounter, setRunsCounter] = useState(0);

  // Set up automated running loop simulation
  useEffect(() => {
    if (!isRunning) return;

    addLog(`Engine active: Executing custom strategy. TP target: $${botConfig.tp}, SL safety: $${botConfig.sl}`, 'success');

    const interval = setInterval(() => {
      setRunsCounter((prev) => prev + 1);

      // Simulates real option outcome matching parameters
      const won = Math.random() > 0.46; // Close to natural binary risk outcome
      const profitValue = won ? botConfig.stake * 0.95 : -botConfig.stake;
      const payoutValue = won ? botConfig.stake * 1.95 : 0;
      
      const randPrice = 700 + Math.random() * 45;
      const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });

      addLog(`[Ultimate Bot] Trade completed! Outcome: ${won ? 'WIN (+$' + (botConfig.stake * 0.95).toFixed(2) + ')' : 'LOSS (-$' + botConfig.stake.toFixed(2) + ')'}`, won ? 'success' : 'error');

      addTransaction({
        id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
        time: nowStr,
        type: 'Buy',
        market: 'Volatility 100 (1s) Index',
        stake: botConfig.stake,
        payout: parseFloat(payoutValue.toFixed(2)),
        profit: parseFloat(profitValue.toFixed(2)),
        status: won ? 'won' : 'lost',
        contractType: 'Ultimate ' + botConfig.initialTradeType,
        exitTick: parseFloat(randPrice.toFixed(2))
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isRunning, botConfig]);

  const toggleRunState = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      addLog("Initializing Ultimate Bot options compiler...", 'info');
    } else {
      addLog("Suspended Ultimate Bot run.", 'warning');
    }
  };

  const resetForm = () => {
    setBotConfig({
      initialTradeType: 'Rise / Fall (Rise Only)',
      recoveryType: 'Martingale Basic',
      lastNTicks: 3,
      stake: 0.5,
      tp: 5.0,
      sl: 30.0,
      enableMartingale: true,
      martingaleMultiplier: 2.0
    });
    setRunsCounter(0);
    addLog("Restored standard Ultimate Bot configuration templates.", "info");
  };

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-120px)] p-6 text-gray-800 font-sans select-none" id="ultimate-bot-panel">
      
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        {/* Header decoration */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-6 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-900 text-white rounded-xl">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-display">Ultimate Strategy Architect</h1>
              <p className="text-xs text-gray-400 mt-0.5">Customize specific compound loops and regression values.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetForm}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-lg transition-all cursor-pointer"
              title="Reset parameters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-gray-400 font-mono">
              Runs: {runsCounter}
            </span>
          </div>
        </div>

        {/* Inputs forms grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Section 1: Money options */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-500 font-mono flex items-center gap-1.5 pb-2 border-b border-gray-100">
              <TrendingUp className="w-4 h-4" /> Capital Limits
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500">STAKE USD:</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={botConfig.stake}
                  onChange={(e) => setBotConfig({ ...botConfig, stake: Math.max(0.1, Number(e.target.value)) })}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-2 font-mono text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500">TARGET PROFIT (TP):</label>
                <input
                  type="number"
                  min="0.5"
                  step="1"
                  value={botConfig.tp}
                  onChange={(e) => setBotConfig({ ...botConfig, tp: Math.max(0.1, Number(e.target.value)) })}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-2 font-mono text-xs font-bold text-emerald-600 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500">STOP LOSS (SL):</label>
                <input
                  type="number"
                  min="1"
                  step="5"
                  value={botConfig.sl}
                  onChange={(e) => setBotConfig({ ...botConfig, sl: Math.max(1, Number(e.target.value)) })}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-2 font-mono text-xs font-bold text-red-600 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5 opacity-80 decoration-slice">
                <label className="text-[11px] font-bold text-gray-400">MAX LOSSES STRIPE:</label>
                <input
                  type="number"
                  value="10"
                  disabled
                  className="bg-gray-100 border border-gray-200 rounded-lg p-2 font-mono text-xs font-bold text-gray-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Warning banner */}
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3.5 flex gap-2.5 text-[11.5px] leading-relaxed text-amber-900 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Capital Warning:</strong> Compound martingale multipliers are applied relative to consecutive losses. Multipliers above 2.0 require adequate funding reserves, else triggers will arrest early.
              </span>
            </div>
          </div>

          {/* Section 2: Strategy options */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#8b5cf6] font-mono flex items-center gap-1.5 pb-2 border-b border-gray-100">
              <Sliders className="w-4 h-4" /> Strategy & Parity Engines
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-500">INITIAL TRADE DIRECTION:</label>
              <select
                value={botConfig.initialTradeType}
                onChange={(e) => setBotConfig({ ...botConfig, initialTradeType: e.target.value })}
                className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs font-bold text-gray-800 cursor-pointer focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="Rise / Fall (Rise Only)">Rise / Fall (Rise Only)</option>
                <option value="Even / Odd Parity switch">Even / Odd Parity switch</option>
                <option value="Over Under 5 dynamic">Over Under 5 dynamic</option>
                <option value="Matches / Differs 10 Ticks">Matches / Differs 10 Ticks</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500">RECOVERY MODE:</label>
                <select
                  value={botConfig.recoveryType}
                  onChange={(e) => setBotConfig({ ...botConfig, recoveryType: e.target.value })}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-bold text-gray-800 cursor-pointer focus:outline-none"
                >
                  <option value="Martingale Basic">Martingale Basic</option>
                  <option value="D'Alembert linear">D'Alembert linear</option>
                  <option value="Fibonacci progression">Fibonacci progression</option>
                  <option value="No Recovery (Flat)">No Recovery (Flat)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500">MARTINGALE coef:</label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  step="0.1"
                  value={botConfig.martingaleMultiplier}
                  onChange={(e) => setBotConfig({ ...botConfig, martingaleMultiplier: Math.max(1, Number(e.target.value)) })}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-2 font-mono text-xs font-bold text-gray-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500">DIGIT TICKS LOOKBACK:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={botConfig.lastNTicks}
                  onChange={(e) => setBotConfig({ ...botConfig, lastNTicks: Math.max(1, Number(e.target.value)) })}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-2 font-mono text-xs font-bold text-gray-800 focus:outline-none"
                />
              </div>

              {/* Trailing toggle checkbox */}
              <div className="flex items-center gap-2 pt-6 pl-1 select-none">
                <input
                  type="checkbox"
                  id="trailing-take-profit"
                  className="rounded text-blue-900 border-gray-350 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="trailing-take-profit" className="text-xs font-bold text-gray-500 cursor-pointer select-none">
                  Trailing Stop-Loss
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Start execution bar */}
        <div className="border-t border-gray-100 pt-5 mt-6 flex justify-end gap-3 select-none">
          <button
            type="button"
            onClick={toggleRunState}
            className={`px-7 py-3.5 rounded-xl font-bold font-display text-xs uppercase text-white shadow-md flex items-center gap-2 cursor-pointer transition-all ${
              isRunning 
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 hover:scale-[1.01]' 
                : 'bg-blue-900 hover:bg-blue-950 shadow-blue-900/20 hover:scale-[1.01]'
            }`}
          >
            {isRunning ? (
              <>
                <StopCircle className="w-4 h-4" />
                <span>Pause Algorithmic Bot</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current animate-pulseHeading" />
                <span>Compile & Execute Bot</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
