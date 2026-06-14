import { useState, useEffect } from 'react';
import { 
  Zap, 
  HelpCircle, 
  RefreshCw, 
  Search, 
  Play, 
  StopCircle,
  TrendingUp,
  Percent,
  Atom,
  AlertTriangle
} from 'lucide-react';

interface AnalysistoolsProps {
  addLog: (msg: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  addTransaction: (tx: any) => void;
}

interface IndexAnalysis {
  name: string;
  price: number;
  ticksCount: number;
  digits: { num: number; percent: number; colorType: 'most' | 'second-most' | 'least' | 'second-least' | 'normal' }[];
  history: number[];
  tradeType: string;
  stake: number;
  ticksValue: number;
}

export default function AnalysistoolsTab({ addLog, addTransaction }: AnalysistoolsProps) {
  const [ticksFilter, setTicksFilter] = useState(120);
  const [activeSubTab, setActiveSubTab] = useState<'DCIRCLE' | 'Analysis'>('DCIRCLE');
  const [isAutoScanning, setIsAutoScanning] = useState(false);

  // Volatility Indices States
  const [indices, setIndices] = useState<IndexAnalysis[]>([
    {
      name: 'Volatility 100 (1s) Index',
      price: 666.38,
      ticksCount: 120,
      digits: [
        { num: 0, percent: 10.8, colorType: 'normal' },
        { num: 1, percent: 10.0, colorType: 'normal' },
        { num: 2, percent: 15.8, colorType: 'most' }, // teal
        { num: 3, percent: 8.3, colorType: 'second-least' },
        { num: 4, percent: 4.2, colorType: 'least' }, // red
        { num: 5, percent: 8.3, colorType: 'normal' },
        { num: 6, percent: 9.2, colorType: 'normal' },
        { num: 7, percent: 10.8, colorType: 'second-most' },
        { num: 8, percent: 10.8, colorType: 'normal' },
        { num: 9, percent: 11.7, colorType: 'normal' },
      ],
      history: [8, 7, 8, 4, 7, 2, 9, 1, 7, 8],
      tradeType: 'Even / Odd',
      stake: 0.5,
      ticksValue: 1
    },
    {
      name: 'Volatility 10 (1s) Index',
      price: 10075.29,
      ticksCount: 120,
      digits: [
        { num: 0, percent: 12.5, colorType: 'normal' },
        { num: 1, percent: 10.0, colorType: 'normal' },
        { num: 2, percent: 10.8, colorType: 'normal' },
        { num: 3, percent: 7.5, colorType: 'second-least' },
        { num: 4, percent: 7.5, colorType: 'least' },
        { num: 5, percent: 14.2, colorType: 'most' },
        { num: 6, percent: 6.7, colorType: 'second-least' },
        { num: 7, percent: 13.3, colorType: 'second-most' },
        { num: 8, percent: 8.3, colorType: 'normal' },
        { num: 9, percent: 9.2, colorType: 'normal' },
      ],
      history: [7, 7, 1, 7, 1, 7, 3, 9, 9, 9],
      tradeType: 'Even / Odd',
      stake: 0.5,
      ticksValue: 1
    },
    {
      name: 'Volatility 50 (1s) Index',
      price: 275372.78,
      ticksCount: 120,
      digits: [
        { num: 0, percent: 9.2, colorType: 'normal' },
        { num: 1, percent: 14.2, colorType: 'most' },
        { num: 2, percent: 12.5, colorType: 'second-most' },
        { num: 3, percent: 10.0, colorType: 'normal' },
        { num: 4, percent: 5.0, colorType: 'least' },
        { num: 5, percent: 7.5, colorType: 'second-least' },
        { num: 6, percent: 10.8, colorType: 'normal' },
        { num: 7, percent: 10.8, colorType: 'normal' },
        { num: 8, percent: 9.2, colorType: 'normal' },
        { num: 9, percent: 10.8, colorType: 'normal' },
      ],
      history: [1, 2, 9, 1, 7, 8, 4, 3, 1, 1],
      tradeType: 'Even / Odd',
      stake: 0.5,
      ticksValue: 1
    }
  ]);

  // Live ticking simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setIndices((prev) => 
        prev.map((ind) => {
          // Tick price
          const pricePct = (Math.random() - 0.5) * 0.04;
          const newPrice = Number((ind.price + (ind.price * pricePct)).toFixed(2));
          
          // Generate new dynamic single-digit live tick
          const newDigit = Math.floor(Math.random() * 10);
          const newHistory = [...ind.history.slice(1), newDigit];

          // Calculate new digit distributions slightly
          const baseCount = ind.ticksCount;
          const originalDist = ind.digits.map(d => d.percent);
          
          // Mutate target index distribution slightly
          const distributionSum = originalDist.reduce((a, b) => a + b, 0);
          let newDist = originalDist.map(pct => {
            const delta = (Math.random() - 0.5) * 0.6;
            return Math.min(Math.max(pct + delta, 3.0), 18.0);
          });
          
          // Re-norm sum to 100%
          const newSum = newDist.reduce((a, b) => a + b, 0);
          newDist = newDist.map(val => (val / newSum) * 100);

          // Classify color ranks
          const sortedPctWithIdx = newDist.map((val, i) => ({ val, i })).sort((a, b) => b.val - a.val);
          const mostIdx = sortedPctWithIdx[0].i;
          const secondMostIdx = sortedPctWithIdx[1].i;
          const leastIdx = sortedPctWithIdx[sortedPctWithIdx.length - 1].i;
          const secondLeastIdx = sortedPctWithIdx[sortedPctWithIdx.length - 2].i;

          const updatedDigits = ind.digits.map((item, idx) => {
            let colorType: 'most' | 'second-most' | 'least' | 'second-least' | 'normal' = 'normal';
            if (idx === mostIdx) colorType = 'most';
            else if (idx === secondMostIdx) colorType = 'second-most';
            else if (idx === leastIdx) colorType = 'least';
            else if (idx === secondLeastIdx) colorType = 'second-least';

            return {
              ...item,
              percent: parseFloat(newDist[idx].toFixed(1)),
              colorType
            };
          });

          // If auto scanning is enabled, occasionally trigger mock trades
          if (isAutoScanning && Math.random() > 0.94) {
            const isEven = newDigit % 2 === 0;
            const chosenPrediction = Math.random() > 0.5 ? 'Even' : 'Odd';
            const isWinner = (isEven && chosenPrediction === 'Even') || (!isEven && chosenPrediction === 'Odd');
            
            const stakeAmt = ind.stake;
            const payoutAmt = isWinner ? stakeAmt * 1.96 : 0;
            const profitAmt = isWinner ? stakeAmt * 0.96 : -stakeAmt;

            addLog(`Auto-Scan Pattern matched on ${ind.name}. Digit: ${newDigit} (${isEven ? 'Even' : 'Odd'}). Trigger: ${chosenPrediction}`, isWinner ? 'success' : 'error');

            const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });
            addTransaction({
              id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
              time: nowStr,
              type: 'Buy',
              market: ind.name,
              stake: stakeAmt,
              payout: parseFloat(payoutAmt.toFixed(2)),
              profit: parseFloat(profitAmt.toFixed(2)),
              status: isWinner ? 'won' : 'lost',
              contractType: chosenPrediction + ' Digit',
              exitTick: newPrice
            });
          }

          return {
            ...ind,
            price: newPrice,
            history: newHistory,
            digits: updatedDigits
          };
        })
      );
    }, 2000);

    return () => clearInterval(timer);
  }, [isAutoScanning]);

  const handleManualTrade = (indexName: string, selection: 'Even' | 'Odd', indPrice: number, stakeVal: number) => {
    addLog(`Reserving contract on ${indexName} for ${selection} Digit...`, 'info');
    
    setTimeout(() => {
      const liveDigit = Math.floor(Math.random() * 10);
      const isEven = liveDigit % 2 === 0;
      const isWinner = (isEven && selection === 'Even') || (!isEven && selection === 'Odd');

      const profit = isWinner ? stakeVal * 0.92 : -stakeVal;
      const payout = isWinner ? stakeVal * 1.92 : 0;

      addLog(`Contract result: Tick matches ${liveDigit} (${isEven ? 'EVEN' : 'ODD'}). Trade ${isWinner ? 'WON' : 'LOST'}!`, isWinner ? 'success' : 'error');
      
      const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });
      addTransaction({
        id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
        time: nowStr,
        type: 'Buy',
        market: indexName,
        stake: stakeVal,
        payout: parseFloat(payout.toFixed(2)),
        profit: parseFloat(profit.toFixed(2)),
        status: isWinner ? 'won' : 'lost',
        contractType: selection + ' Digit',
        exitTick: indPrice
      });
    }, 850);
  };

  const handleAutoScanAll = () => {
    setIsAutoScanning(!isAutoScanning);
    addLog(isAutoScanning 
      ? "Suspended automatic pattern scanner." 
      : "Initiating live multi-index digit pattern auto-scanner. Monitoring trend biases...", "info");
  };

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-120px)] text-gray-800 p-4" id="analysis-tools-tab-panel">
      
      {/* Tab Header sub-menu */}
      <div className="flex bg-white rounded-lg p-1 border border-gray-200 mb-4 max-w-xs text-xs font-bold shadow-sm">
        <button 
          onClick={() => setActiveSubTab('DCIRCLE')}
          className={`flex-1 py-1.5 rounded transition-all cursor-pointer text-center ${activeSubTab === 'DCIRCLE' ? 'bg-blue-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          DCIRCLE
        </button>
        <button 
          onClick={() => setActiveSubTab('Analysis')}
          className={`flex-1 py-1.5 rounded transition-all cursor-pointer text-center ${activeSubTab === 'Analysis' ? 'bg-blue-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Analysis Panel
        </button>
      </div>

      {/* Configuration Legend Ribbon bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">LEGEND:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Most
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] font-bold border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span> 2nd Most
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-[11px] font-bold border border-red-100">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Least
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[11px] font-bold border border-amber-100">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> 2nd Least
          </span>
        </div>

        {/* Ticks Range filters exactly conforming screenshot */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-gray-500 font-medium">No. of Ticks:</span>
          <div className="flex bg-gray-150 border border-gray-200 rounded-lg p-0.5 font-mono font-bold text-[11px]">
            {[30, 60, 100, 120, 240, 500, 1000].map((ticks) => (
              <button
                key={ticks}
                onClick={() => setTicksFilter(ticks)}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${ticksFilter === ticks ? 'bg-[#0f224a] text-white' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {ticks}
              </button>
            ))}
          </div>

          <button 
            onClick={handleAutoScanAll}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer shadow-sm transition-all text-[11px] ${
              isAutoScanning 
                ? 'bg-rose-600 text-white hover:bg-rose-700' 
                : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isAutoScanning ? 'animate-bounce' : 'animate-pulse'}`} />
            <span>{isAutoScanning ? 'Stop Scan' : 'Auto Scan'}</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'DCIRCLE' ? (
        /* Multi-Volatility Panels grid exactly matching style from screenshot 6 */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dcircle-panels">
          {indices.map((ind, cellIdx) => (
            <div key={ind.name} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative">
              
              {/* Card header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Atom className="w-4 h-4 text-blue-900 animate-spin" />
                  <span className="font-bold text-sm text-gray-800">{ind.name}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-mono font-bold text-gray-400 uppercase">Live Tick Price</span>
                  <span className="font-mono text-sm font-black text-blue-600 animate-pulse tracking-tight">{ind.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Ticks Percentages circles rows */}
              <div className="grid grid-cols-5 gap-3 mb-5 font-sans" id="dig-circles-row">
                {ind.digits.map((digit) => {
                  let badgeColor = 'bg-gray-50 border-gray-150 text-gray-700';
                  if (digit.colorType === 'most') badgeColor = 'bg-teal-50 border-teal-200 text-teal-800 ring-2 ring-teal-500/15 font-extrabold';
                  else if (digit.colorType === 'second-most') badgeColor = 'bg-blue-50 border-blue-200 text-blue-700';
                  else if (digit.colorType === 'least') badgeColor = 'bg-red-50 border-red-200 text-red-700 ring-2 ring-red-500/10 font-extrabold';
                  else if (digit.colorType === 'second-least') badgeColor = 'bg-amber-50 border-amber-200 text-amber-700';

                  return (
                    <div 
                      key={digit.num} 
                      className={`border px-2.5 py-3 rounded-xl flex flex-col items-center justify-between transition-all select-none ${badgeColor}`}
                    >
                      <span className="text-sm font-black font-display">{digit.num}</span>
                      <span className="text-[10px] font-mono font-bold mt-1 scale-95">{digit.percent}%</span>
                    </div>
                  );
                })}
              </div>

              {/* Horizontal ticker stream digits (Teal for Evens, Red for Odds) aligned with screenshot layout */}
              <div className="mb-5 select-none">
                <span className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-widest block mb-2">Ticks tape stream:</span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1" id="tick-tiles-strip">
                  {ind.history.map((hDigit, hIdx) => {
                    const isEven = hDigit % 2 === 0;
                    return (
                      <span
                        key={hIdx}
                        className={`inline-block w-8 py-1.5 rounded-md font-mono font-black text-center text-xs text-white shadow-sm transition-all scale-[1.01] ${isEven ? 'bg-teal-500 shadow-teal-500/20' : 'bg-red-500 shadow-red-500/20'}`}
                      >
                        {hDigit}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Trade configuration controls */}
              <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl mb-4 border border-gray-100 select-none">
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-gray-400 font-semibold">Trade type:</span>
                  <select 
                    value={ind.tradeType}
                    onChange={(e) => {
                      const updated = [...indices];
                      updated[cellIdx].tradeType = e.target.value;
                      setIndices(updated);
                      addLog(`Scanning method changed to: ${e.target.value}`, "info");
                    }}
                    className="bg-white border border-gray-200 rounded px-1.5 py-1 text-xs focus:outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="Even / Odd">Even / Odd</option>
                    <option value="Matches / Differs">Matches / Differs</option>
                    <option value="Over / Under">Over / Under</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-gray-400 font-semibold">Stake:</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={ind.stake}
                    onChange={(e) => {
                      const updated = [...indices];
                      updated[cellIdx].stake = Math.max(0.1, Number(e.target.value));
                      setIndices(updated);
                    }}
                    className="bg-white border border-gray-200 rounded px-1.5 py-1 text-xs focus:outline-none focus:border-blue-500 font-mono font-bold"
                  />
                </div>

                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-gray-400 font-semibold">Ticks:</span>
                  <input
                    type="number"
                    min="1"
                    value={ind.ticksValue}
                    onChange={(e) => {
                      const updated = [...indices];
                      updated[cellIdx].ticksValue = Math.max(1, Number(e.target.value));
                      setIndices(updated);
                    }}
                    className="bg-white border border-gray-200 rounded px-1.5 py-1 text-xs focus:outline-none focus:border-blue-500 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Purchase action split buttons exactly like the image in screenshot 6 */}
              <div className="flex items-center gap-2 font-display select-none">
                <button
                  type="button"
                  onClick={() => handleManualTrade(ind.name, 'Even', ind.price, ind.stake)}
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.01] active:scale-95"
                >
                  <span className="text-sm font-black tracking-tight leading-none">Even</span>
                  <span className="text-[10px] font-mono font-semibold text-teal-100 mt-1 leading-none">payout USD {(ind.stake * 1.92).toFixed(2)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleManualTrade(ind.name, 'Odd', ind.price, ind.stake)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.01] active:scale-95"
                >
                  <span className="text-sm font-black tracking-tight leading-none font-bold">Odd</span>
                  <span className="text-[10px] font-mono font-semibold text-red-100 mt-1 leading-none">payout USD {(ind.stake * 1.92).toFixed(2)}</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Analysis Panel informative template with tips and strategies */
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Atom className="w-5 h-5 text-indigo-600" />
            Digit Distribution Analysis Guidelines
          </h2>
          <div className="space-y-4 text-xs leading-relaxed text-gray-600">
            <p>
              Automated Binary tools utilize standard statistics to capture trend anomalies. For example, in 100 consecutive ticks, every single digit (0 through 9) carries a theoretical uniform probability of <span className="font-bold underline text-blue-600">10%</span>.
            </p>
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg flex gap-2.5 text-amber-950 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Martingale Bias note:</strong> Frequent streak deviations (e.g., getting 8 consecutive ODD digits) occurs in high-speed ticks on synthetic indices. Never establish heavy multipliers without securing your stop-loss margins first.
              </span>
            </div>
            <p>
              The circular percentages grid above (re-calculated in real time directly from our ticking price streams) tags indices that temporarily have high structural deviation. Click their respective Even/Odd buttons to test transactions safely under your simulated Virtual Account limit.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
