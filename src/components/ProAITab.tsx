import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Sliders, 
  Play, 
  Pause, 
  Terminal, 
  Lightbulb, 
  Activity,
  CheckCircle,
  Eye,
  Settings
} from 'lucide-react';

interface ProAIProps {
  addLog: (msg: string, type: 'info' | 'success' | 'error' | 'warning') => void;
}

interface AIStrategy {
  id: string;
  name: string;
  rule: string;
  ticksWait: number;
  triggerBound: number;
  direction: 'OVER' | 'UNDER';
  active: boolean;
  cyclesCount: number;
}

export default function ProAITab({ addLog }: ProAIProps) {
  const [strategies, setStrategies] = useState<AIStrategy[]>([
    { id: 'o1', name: 'Over 1 Pro', rule: 'Waits for 3 consecutive digits at or below 1', ticksWait: 3, triggerBound: 1, direction: 'OVER', active: true, cyclesCount: 14 },
    { id: 'u8', name: 'Under 8 Pro', rule: 'Waits for 3 consecutive digits at or above 8', ticksWait: 3, triggerBound: 8, direction: 'UNDER', active: false, cyclesCount: 8 },
    { id: 'o2', name: 'Over 2 Pro', rule: 'Waits for 4 consecutive digits at or below 2', ticksWait: 4, triggerBound: 2, direction: 'OVER', active: false, cyclesCount: 22 },
    { id: 'u7', name: 'Under 7 Pro', rule: 'Waits for 4 consecutive digits at or above 7', ticksWait: 4, triggerBound: 7, direction: 'UNDER', active: true, cyclesCount: 19 },
    { id: 'o3', name: 'Over 3 Pro', rule: 'Waits for 5 consecutive digits at or below 3', ticksWait: 5, triggerBound: 3, direction: 'OVER', active: false, cyclesCount: 3 },
    { id: 'u6', name: 'Under 6 Pro', rule: 'Waits for 5 consecutive digits at or above 6', ticksWait: 5, triggerBound: 6, direction: 'UNDER', active: false, cyclesCount: 5 },
  ]);

  // Simulate active AI strategizer scanning logs
  useEffect(() => {
    const scanTimer = setInterval(() => {
      setStrategies((prev) => 
        prev.map((strat) => {
          if (!strat.active) return strat;
          
          // Trigger a match simulation occasionally
          const matchTriggered = Math.random() > 0.85;
          if (matchTriggered) {
            const randomDigitHistory = Array.from({ length: strat.ticksWait }, () => 
              strat.direction === 'OVER' 
                ? Math.floor(Math.random() * (strat.triggerBound + 1)) 
                : Math.floor(strat.triggerBound + Math.random() * (10 - strat.triggerBound))
            ).join(', ');

            addLog(`[Pro AI] Strategy: ${strat.name} matched pattern on Volatility. Sequence detected: [${randomDigitHistory}]. Simulating purchase boundary...`, 'info');
          }

          return {
            ...strat,
            cyclesCount: strat.cyclesCount + 1
          };
        })
      );
    }, 6000);

    return () => clearInterval(scanTimer);
  }, []);

  const handleToggleStrategy = (id: string, name: string) => {
    setStrategies((prev) => 
      prev.map((strat) => {
        if (strat.id === id) {
          const nextState = !strat.active;
          addLog(nextState 
            ? `Activated scan algorithm: ${name}. Monitoring matching ticks...` 
            : `Deactivated scan algorithm: ${name}.`, nextState ? 'success' : 'warning');
          return { ...strat, active: nextState };
        }
        return strat;
      })
    );
  };

  return (
    <div className="bg-[#020b1e] text-white min-h-[calc(100vh-120px)] p-6 font-sans relative overflow-hidden" id="pro-ai-tab-panel">
      
      {/* Decorative vector grid shapes */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Hero section conforming layout of screenshot 4 */}
      <div className="max-w-6xl mx-auto mb-8 border-b border-gray-800 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#38bdf8] font-mono">AUTOMATED DIGIT ENTRIES</span>
        <h1 className="text-3xl font-display font-black tracking-tight mt-1 flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-indigo-400 animate-pulse" />
          Pro AI Scan Center
        </h1>
        <p className="text-sm text-gray-400 mt-2 select-none">
          Select a strategy, configure the scan, and let it watch every matching volatility market.
        </p>
      </div>

      {/* Strategies cards grid matched with style and layout in screenshot 4 */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" id="pro-ai-cards-grid">
        {strategies.map((strat) => (
          <div 
            key={strat.id}
            className={`bg-[#050e24] border rounded-xl p-5 hover:scale-[1.01] transition-all flex flex-col justify-between ${
              strat.active ? 'border-indigo-500/60 shadow-lg shadow-indigo-950/20' : 'border-blue-950 hover:border-gray-800'
            }`}
          >
            <div>
              {/* Header card */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-gray-100 flex items-center gap-2 text-sm">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${strat.active ? 'bg-indigo-400 animate-ping' : 'bg-gray-600'}`}></span>
                  {strat.name}
                </span>

                <span className="text-[9px] font-mono bg-blue-950 text-blue-300 font-bold px-2 py-0.5 rounded-full">
                  Cycles: {strat.cyclesCount}
                </span>
              </div>

              {/* Strategy rules */}
              <div className="bg-[#081535] p-3 rounded-lg border border-blue-950 text-xs font-mono text-gray-300 mb-4 h-16 flex items-center">
                {strat.rule}
              </div>

              {/* Interactive sliders adjustments display */}
              <div className="text-[11px] text-gray-400 space-y-1.5 pb-2 font-semibold">
                <div className="flex justify-between">
                  <span>Match threshold:</span>
                  <span className="text-gray-100">{strat.ticksWait} ticks</span>
                </div>
                <div className="flex justify-between">
                  <span>Regression limit:</span>
                  <span className="text-gray-100">Digit {strat.direction === 'OVER' ? '<= ' + strat.triggerBound : '>= ' + strat.triggerBound}</span>
                </div>
              </div>
            </div>

            {/* OPEN button action aligned right bottom exactly like in the screens */}
            <div className="border-t border-gray-800/40 pt-4 mt-3 flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase ${strat.active ? 'text-indigo-400 font-black' : 'text-gray-500'}`}>
                {strat.active ? '● LIVE SCANNING' : '○ ASLEEP'}
              </span>

              <button
                type="button"
                onClick={() => handleToggleStrategy(strat.id, strat.name)}
                className={`text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded transition-all cursor-pointer ${
                  strat.active 
                    ? 'text-white bg-indigo-600 hover:bg-indigo-700 font-bold' 
                    : 'text-[#38bdf8] bg-blue-950/40 hover:bg-blue-900 border border-blue-900/60 font-semibold'
                }`}
              >
                {strat.active ? 'PAUSE' : 'OPEN'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Scanner telemetry logging display terminal */}
      <div className="max-w-6xl mx-auto bg-[#030a18] rounded-xl border border-blue-950/60 p-4 font-mono select-text" id="ai-telemetry-console">
        <div className="flex items-center justify-between border-b border-blue-950/60 pb-2 mb-3.5 text-xs text-blue-400">
          <span className="flex items-center gap-1.5 font-bold">
            <Terminal className="w-4 h-4 text-blue-500" />
            AI TELEMETRY DECODER CORES
          </span>
          <span className="text-[10px] bg-blue-950/80 px-2 py-0.5 rounded text-blue-300">STREAMING</span>
        </div>
        <div className="text-[11px] text-gray-400 space-y-1.5 max-h-36 overflow-y-auto">
          <div>[INFO - {new Date().toLocaleTimeString('en-US', { hour12: false })}] Systems initialized. Pattern arrays configured to watch all volatility segments.</div>
          <div>[SCAN - O1] Over 1 Pro scanning Volatility 100 Ticks: [8, 5, 2] -- waiting for consecutive values &lt;= 1</div>
          <div>[SCAN - U7] Under 7 Pro scanning Volatility 75 Ticks: [3, 9, 7] -- waiting for consecutive values &gt;= 7</div>
          <div className="text-gray-500">// End of historic telemetry. Logs are continuously mirrored into the sidebar Journal.</div>
        </div>
      </div>

    </div>
  );
}
