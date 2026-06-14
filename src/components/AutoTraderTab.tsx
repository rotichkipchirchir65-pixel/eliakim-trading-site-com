import { useState, useEffect } from 'react';
import { 
  Percent, 
  HelpCircle, 
  Play, 
  StopCircle, 
  Settings, 
  Sparkles, 
  Activity,
  ArrowRight,
  Eye,
  RefreshCw
} from 'lucide-react';

interface AutoTraderProps {
  addLog: (msg: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  addTransaction: (tx: any) => void;
}

export default function AutoTraderTab({ addLog, addTransaction }: AutoTraderProps) {
  // Digit Card state
  const [digitTicksTrigger, setDigitTicksTrigger] = useState(5);
  const [digitMatchSelection, setDigitMatchSelection] = useState('Even');
  const [digitStake, setDigitStake] = useState(0.5);
  const [digitMartingale, setDigitMartingale] = useState(1.2);
  const [isDigitRunning, setIsDigitRunning] = useState(false);
  const [digitHistory, setDigitHistory] = useState<('E' | 'O')[]>(['E', 'E', 'O', 'E', 'E', 'E', 'E', 'E', 'E', 'E']);

  // Percentage Card state
  const [evenPct, setEvenPct] = useState(50.20);
  const [oddPct, setOddPct] = useState(49.80);
  const [pctConditionType, setPctConditionType] = useState('Even%');
  const [pctConditionValue, setPctConditionValue] = useState(60);
  const [pctStake, setPctStake] = useState(0.5);
  const [pctMartingale, setPctMartingale] = useState(1.2);
  const [isPctRunning, setIsPctRunning] = useState(false);

  // Simulate progress percentages ticking
  useEffect(() => {
    const timer = setInterval(() => {
      // Rotate digit circles occasionally
      setDigitHistory((prev) => {
        const nextLetter = Math.random() > 0.5 ? 'E' : 'O';
        return [...prev.slice(1), nextLetter];
      });

      // Fluctuate even/odd percent card slightly
      setEvenPct((prev) => {
        const delta = (Math.random() - 0.5) * 1.6;
        const newEven = Math.min(Math.max(prev + delta, 35), 65);
        setOddPct(parseFloat((100 - newEven).toFixed(2)));
        return parseFloat(newEven.toFixed(2));
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Simulating auto trading runs
  useEffect(() => {
    if (!isDigitRunning && !isPctRunning) return;

    const runTimer = setInterval(() => {
      if (isDigitRunning) {
        // Evaluate digit logic: E.g. check if last 5 digits matching condition
        const recentSubset = digitHistory.slice(-digitTicksTrigger);
        const countMatching = recentSubset.filter(x => x === (digitMatchSelection === 'Even' ? 'E' : 'O')).length;
        
        // Let's mock a buy check
        if (countMatching >= 3) {
          const outcomeWinner = Math.random() > 0.48; // ~52% win probability
          const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });
          const profit = outcomeWinner ? digitStake * 0.95 : -digitStake;
          const payout = outcomeWinner ? digitStake * 1.95 : 0;

          addLog(`[Auto Trader] Digits strategy triggered on Volatility 100 Index. Prediction: ${digitMatchSelection}, Outcome: ${outcomeWinner ? 'WIN' : 'LOSS'}`, outcomeWinner ? 'success' : 'error');
          
          addTransaction({
            id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
            time: nowStr,
            type: 'Buy',
            market: 'Volatility 100 Index',
            stake: digitStake,
            payout: parseFloat(payout.toFixed(2)),
            profit: parseFloat(profit.toFixed(2)),
            status: outcomeWinner ? 'won' : 'lost',
            contractType: 'Auto ' + digitMatchSelection,
            exitTick: 650 + Math.random() * 12
          });
        }
      }

      if (isPctRunning) {
        // Compare percentages threshold
        const targetPct = pctConditionType === 'Even%' ? evenPct : oddPct;
        if (targetPct >= pctConditionValue) {
          const outcomeWinner = Math.random() > 0.5;
          const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });
          const profit = outcomeWinner ? pctStake * 0.95 : -pctStake;
          const payout = outcomeWinner ? pctStake * 1.95 : 0;

          addLog(`[Auto Trader] Percentage strategy threshold met (${targetPct}%). executing order. Result: ${outcomeWinner ? 'WON' : 'LOST'}`, outcomeWinner ? 'success' : 'error');

          addTransaction({
            id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
            time: nowStr,
            type: 'Buy',
            market: 'Volatility 100 Index',
            stake: pctStake,
            payout: parseFloat(payout.toFixed(2)),
            profit: parseFloat(profit.toFixed(2)),
            status: outcomeWinner ? 'won' : 'lost',
            contractType: 'Pct ' + pctConditionType,
            exitTick: 650 + Math.random() * 12
          });
        }
      }
    }, 5500);

    return () => clearInterval(runTimer);
  }, [isDigitRunning, isPctRunning, digitHistory, evenPct, oddPct, digitMatchSelection, digitStake, pctConditionType, pctConditionValue, pctStake]);

  const toggleDigitBot = () => {
    setIsDigitRunning(!isDigitRunning);
    addLog(isDigitRunning
      ? "Suspended Even/Odd (Digits) bot scanning."
      : "Launched Even/Odd (Digits) bot. Watching pattern stream bounds...", "success");
  };

  const togglePctBot = () => {
    setIsPctRunning(!isPctRunning);
    addLog(isPctRunning
      ? "Suspended Even/Odd (Percentages) bot scanning."
      : "Launched Even/Odd (Percentages) bot. Waiting for target index thresholds...", "success");
  };

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-120px)] text-gray-800 p-6 font-sans select-none" id="auto-trader-tab-panel">
      {/* Cards layout aligned with Screenshot 3 */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8" id="auto-trader-cards-row">
        
        {/* Card 1: Even/Odd (Digits) */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <span className="font-bold text-sm text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                Even/Odd (Digits) Strategy
              </span>
              <Settings className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>

            {/* Sub market details */}
            <div className="mb-4">
              <select className="bg-gray-50 border border-gray-200 font-semibold rounded px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500 text-gray-800">
                <option>Volatility 100 Index</option>
                <option>Volatility 75 Index</option>
              </select>
            </div>

            {/* Live Toggling Tape dots represented in screenshot 3 */}
            <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1" id="evenodd-circles-list">
              {digitHistory.map((item, idx) => (
                <span
                  key={idx}
                  className={`inline-block w-6 h-6 rounded-full font-mono font-black text-center text-[10px] leading-6 select-none ${
                    item === 'E' 
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/10' 
                      : 'bg-red-500 text-white shadow-sm shadow-red-500/10'
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Extra summary text details */}
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold mb-4 pr-1">
              <span>Current streak: 7x even</span>
              <button className="text-blue-500 hover:underline">Show more</button>
            </div>

            {/* Condition Panel exactly mirroring screenshot 3 */}
            <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl text-xs mb-5">
              <span className="text-[10px] text-blue-500 font-bold tracking-wider font-mono block mb-2 uppercase">TRIGGER CONDITION</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span>Check if the last</span>
                <input 
                  type="number" 
                  min="1"
                  max="10"
                  value={digitTicksTrigger}
                  onChange={(e) => setDigitTicksTrigger(Number(e.target.value))}
                  className="w-11 bg-white border border-gray-250 rounded font-mono font-bold py-0.5 text-center text-xs focus:outline-none"
                />
                <span>digits are</span>
                <select 
                  value={digitMatchSelection}
                  onChange={(e) => setDigitMatchSelection(e.target.value)}
                  className="bg-white border border-gray-250 rounded font-bold px-1 py-0.5 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="Even">Even</option>
                  <option value="Odd">Odd</option>
                </select>
                <span>Then trade Even</span>
              </div>
            </div>

            {/* Numerical params row */}
            <div className="grid grid-cols-3 gap-3 text-xs mb-5 select-none">
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-400 font-semibold">TICKS:</span>
                <input 
                  type="number" 
                  className="bg-gray-50 border border-gray-200 font-mono font-bold text-xs p-1.5 rounded focus:outline-none focus:bg-white" 
                  placeholder="Ticks count" 
                  value="1" 
                  disabled
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-400 font-semibold">STAKE:</span>
                <input 
                  type="number" 
                  className="bg-gray-50 border border-gray-200 font-mono font-bold text-xs p-1.5 rounded focus:outline-none focus:bg-white" 
                  value={digitStake}
                  onChange={(e) => setDigitStake(Math.max(0.1, Number(e.target.value)))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-400 font-semibold">MARTINGALE:</span>
                <input 
                  type="number" 
                  step="0.1"
                  className="bg-gray-50 border border-gray-200 font-mono font-bold text-xs p-1.5 rounded focus:outline-none focus:bg-white" 
                  value={digitMartingale}
                  onChange={(e) => setDigitMartingale(Math.max(1, Number(e.target.value)))}
                />
              </div>
            </div>
          </div>

          {/* Running trigger button */}
          <button
            type="button"
            onClick={toggleDigitBot}
            className={`w-full py-3 rounded-xl text-xs font-black uppercase text-white shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all ${
              isDigitRunning 
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/10' 
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10'
            }`}
          >
            {isDigitRunning ? (
              <>
                <StopCircle className="w-4 h-4" />
                <span>Pause Auto Trading</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Auto Trading</span>
              </>
            )}
          </button>
        </div>

        {/* Card 2: Even/Odd (Percentages) */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <span className="font-bold text-sm text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                Even/Odd (Percentages) Strategy
              </span>
              <Settings className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>

            {/* Sub market selector */}
            <div className="mb-4">
              <select className="bg-gray-50 border border-gray-200 font-semibold rounded px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500 text-gray-800">
                <option>Volatility 100 Index</option>
                <option>Volatility 50 index</option>
              </select>
            </div>

            {/* Split Progress percent bars representing screenshot 3 */}
            <div className="p-1 px-1.5 bg-gray-100 border border-gray-250 rounded-xl mb-4 font-mono font-bold select-none shadow-inner">
              <div className="flex h-7 rounded overflow-hidden select-none relative text-[11px] leading-7">
                <div 
                  className="bg-emerald-500 text-white pl-3 text-left transition-all duration-700 font-black h-full" 
                  style={{ width: `${evenPct}%` }}
                >
                  Even: {evenPct}%
                </div>
                <div 
                  className="bg-red-500 text-white pr-3 text-right transition-all duration-700 font-black h-full flex-1"
                >
                  Odd: {oddPct}%
                </div>
              </div>
            </div>

            {/* Hidden auxiliary text filler */}
            <div className="h-6 mb-2"></div>

            {/* Condition parameters exactly matching screenshot 3 */}
            <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl text-xs mb-5">
              <span className="text-[10px] text-blue-500 font-bold tracking-wider font-mono block mb-2 uppercase">TRIGGER CONDITION</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span>If</span>
                <select 
                  value={pctConditionType}
                  onChange={(e) => setPctConditionType(e.target.value)}
                  className="bg-white border border-gray-250 rounded font-bold px-1 py-0.5 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="Even%">Even%</option>
                  <option value="Odd%">Odd%</option>
                </select>
                <span className="font-bold text-gray-700 font-mono">&gt;=</span>
                <input 
                  type="number" 
                  min="50"
                  max="90"
                  value={pctConditionValue}
                  onChange={(e) => setPctConditionValue(Number(e.target.value))}
                  className="w-12 bg-white border border-gray-250 rounded font-mono font-bold py-0.5 text-center text-xs focus:outline-none"
                />
                <span>% then trade Even</span>
              </div>
            </div>

            {/* Numerical variables */}
            <div className="grid grid-cols-3 gap-3 text-xs mb-5 select-none">
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-400 font-semibold">TICKS:</span>
                <input 
                  type="number" 
                  className="bg-gray-50 border border-gray-200 font-mono font-bold text-xs p-1.5 rounded focus:outline-none focus:bg-white" 
                  placeholder="Ticks count" 
                  value="1" 
                  disabled
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-400 font-semibold">STAKE:</span>
                <input 
                  type="number" 
                  className="bg-gray-50 border border-gray-200 font-mono font-bold text-xs p-1.5 rounded focus:outline-none focus:bg-white" 
                  value={pctStake}
                  onChange={(e) => setPctStake(Math.max(0.1, Number(e.target.value)))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-400 font-semibold">MARTINGALE:</span>
                <input 
                  type="number" 
                  step="0.1"
                  className="bg-gray-50 border border-gray-200 font-mono font-bold text-xs p-1.5 rounded focus:outline-none focus:bg-white" 
                  value={pctMartingale}
                  onChange={(e) => setPctMartingale(Math.max(1, Number(e.target.value)))}
                />
              </div>
            </div>
          </div>

          {/* Start button + spinner exactly conforming screenshot 3 */}
          <div className="flex flex-col gap-2 w-full">
            <button
              type="button"
              onClick={togglePctBot}
              className={`w-full py-3 rounded-xl text-xs font-black uppercase text-white shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isPctRunning 
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/10' 
                  : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10'
              }`}
            >
              {isPctRunning ? (
                <>
                  <StopCircle className="w-4 h-4" />
                  <span>Pause Auto Trade</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current animate-pulse" />
                  <span>Start Auto Trade</span>
                </>
              )}
            </button>
            
            {/* Spinning waiting state matching the indicator in screenshot */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-gray-400 font-mono select-none">
                <RefreshCw className={`w-3.5 h-3.5 text-blue-500 ${isPctRunning ? 'animate-spin' : 'text-gray-300'}`} />
                <span>{isPctRunning ? 'Tracking Pattern...' : '○ Waiting...'}</span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
