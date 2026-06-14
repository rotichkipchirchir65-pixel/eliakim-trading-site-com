import { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  Zap, 
  Award, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  Activity,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { TabType, MarketSignal } from '../types';

interface DashboardProps {
  username: string;
  setActiveTab: (tab: TabType) => void;
  addLog: (msg: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  loadSignalToBot: (signal: MarketSignal) => void;
}

const QUOTES = [
  "🔒 Risk management is your superpower.",
  "🚀 Every tick is an opportunity. Stay ready.",
  "💸 Trade to grow wealth, not to gamble.",
  "📊 Consistency over intense bursts wins the marathon.",
  "🛡️ Protect your entry capital before targeting payouts."
];

export default function DashboardTab({ 
  username, 
  setActiveTab, 
  addLog,
  loadSignalToBot
}: DashboardProps) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real-time ticking signals
  const [signals, setSignals] = useState<MarketSignal[]>([
    {
      id: 1,
      market: 'Volatility 25 (1s) Index',
      condition: 'Over 4 should be above 55% and Most & 2nd Most appearing digit should be in 5–9.',
      description: 'Waits for consecutive high digits to trigger an Over 4 buy contract.',
      values: [
        { key: 'Over 4%', value: '63.3%' },
        { key: 'Most Digit', value: '7 (16.7%)' },
        { key: '2nd Most', value: '9 (12.5%)' },
        { key: 'Least Digit', value: '3 (5.0%)' }
      ],
      confidence: 53.9,
      type: 'OVER',
      target: 4,
      actionLabel: 'Load Over 4 Signal'
    },
    {
      id: 2,
      market: 'Volatility 50 Index',
      condition: 'Odd% should be above 55% & Most appearing digits should be odd.',
      description: 'Waits for high odd ratio to execute an Odd trade strategy.',
      values: [
        { key: 'Odd Ratio', value: '60.8%' },
        { key: 'Most Digit', value: '5 (13.3%)' },
        { key: '2nd Most', value: '1 (12.5%)' },
        { key: 'Least Digit', value: '8 (5.0%)' }
      ],
      confidence: 51.1,
      type: 'ODD',
      target: 1,
      actionLabel: 'Load Odd Signal'
    },
    {
      id: 3,
      market: 'Volatility 100 (1s) Index',
      condition: 'Odd% should be above 55% and Most appearing digits should be odd.',
      description: 'High momentum scanning for odd digits on speedy 1s index.',
      values: [
        { key: 'Odd Ratio', value: '57.5%' },
        { key: 'Most Digit', value: '1 (14.2%)' },
        { key: '2nd Most', value: '9 (12.5%)' },
        { key: 'Least Digit', value: '6 (5.8%)' }
      ],
      confidence: 40.8,
      type: 'ODD',
      target: 1,
      actionLabel: 'Load Odd Signal'
    },
    {
      id: 4,
      market: 'Volatility 75 Index',
      condition: 'Under 5 should be above 55% and Most appearing digit should be in 0–4.',
      description: 'Scans for steady low-digit sequences for Under 5 premium trades.',
      values: [
        { key: 'Under 5%', value: '56.7%' },
        { key: 'Most Digit', value: '4 (15.0%)' },
        { key: '2nd Most', value: '2 (13.3%)' },
        { key: 'Least Digit', value: '6 (6.7%)' }
      ],
      confidence: 39.2,
      type: 'UNDER',
      target: 5,
      actionLabel: 'Load Under 5 Signal'
    }
  ]);

  // Rotate motivational quotes every 12 seconds
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 12000);
    return () => clearInterval(quoteTimer);
  }, []);

  // Simulate real-time signal ticking
  useEffect(() => {
    const tickingTimer = setInterval(() => {
      setSignals((prevSignals) => 
        prevSignals.map((sig) => {
          // Adjust confidence by tiny random bounds
          const confidenceDelta = (Math.random() - 0.5) * 1.8;
          const newConfidence = Math.min(Math.max(sig.confidence + confidenceDelta, 30), 75);

          // Adjust primary percentage value
          const primaryVal = parseFloat(sig.values[0].value);
          const valDelta = (Math.random() - 0.5) * 1.5;
          const newVal = Math.min(Math.max(primaryVal + valDelta, 45), 70).toFixed(1);

          const updatedValues = [...sig.values];
          updatedValues[0] = { ...updatedValues[0], value: `${newVal}%` };

          // Randomly shuffle most appearing digits slightly
          if (Math.random() > 0.70) {
            const digit = Math.floor(Math.random() * 10);
            const freq = (11 + Math.random() * 6).toFixed(1);
            updatedValues[1] = { ...updatedValues[1], value: `${digit} (${freq}%)` };
          }

          return {
            ...sig,
            confidence: parseFloat(newConfidence.toFixed(1)),
            values: updatedValues
          };
        })
      );
    }, 3500);

    return () => clearInterval(tickingTimer);
  }, []);

  const handleXMLUpload = () => {
    addLog("Analyzing XML schema from file stream...", "info");
    setTimeout(() => {
      addLog("Successfully decoded XML file. Strategy: Apex Streak Master loaded!", "success");
      setActiveTab("Bot Builder");
    }, 1200);
  };

  const handleActionClick = (sig: MarketSignal) => {
    loadSignalToBot(sig);
    addLog(`Transferred real-time signal context: ${sig.market} (${sig.type}) into core engine`, "success");
    addLog("Pre-populated initial inputs! Toggle over to 'Ultimate Bot' or 'Auto Trader' to launch.", "info");
    setActiveTab("Ultimate Bot");
  };

  const filteredSignals = signals.filter(s => 
    s.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#020b1e] text-white min-h-[calc(100vh-120px)] p-6 font-sans relative overflow-hidden" id="dashboard-tab-panel">
      {/* Background ambient decorative glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Hero Header */}
      <div className="max-w-6xl mx-auto mb-8 border-b border-gray-800/60 pb-6">
        <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 font-mono">AUTOMATED DIGIT ENTRIES</span>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight mt-1 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-blue-200">
          Hello {username || 'ROT91864236'}
        </h1>
        <p className="text-amber-400/95 font-medium italic text-sm mt-2 font-display select-none h-6 transition-all duration-500">
          " {QUOTES[quoteIndex]} "
        </p>
      </div>

      {/* Quick Access Macros Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10" id="macros-row">
        {/* Load Bot Card */}
        <button 
          onClick={handleXMLUpload}
          className="bg-[#06122d] border border-blue-900/40 p-5 rounded-xl hover:border-blue-500/50 hover:bg-[#091b42]/80 transition-all text-left flex items-start gap-4 group cursor-pointer"
        >
          <div className="p-3 bg-blue-900/30 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-100">Load Bot</h3>
            <p className="text-xs text-gray-400 mt-1">Import XML strategies from your workspace.</p>
          </div>
        </button>

        {/* Speed Bot Card */}
        <button 
          onClick={() => setActiveTab('Speedbot')}
          className="bg-[#06122d] border border-blue-900/40 p-5 rounded-xl hover:border-blue-500/50 hover:bg-[#091b42]/80 transition-all text-left flex items-start gap-4 group cursor-pointer"
        >
          <div className="p-3 bg-amber-950/40 rounded-lg text-amber-500 group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-100">Speed Bot</h3>
            <p className="text-xs text-gray-400 mt-1">Build guided custom strategies in seconds.</p>
          </div>
        </button>

        {/* Premium Bot Card */}
        <button 
          onClick={() => setActiveTab('Free Bots')}
          className="bg-[#06122d] border border-blue-900/40 p-5 rounded-xl hover:border-blue-500/50 hover:bg-[#091b42]/80 transition-all text-left flex items-start gap-4 group cursor-pointer"
        >
          <div className="p-3 bg-purple-950/40 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
            <Award className="w-5 h-5 hover:rotate-12 transition-transform" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-100">Premium Bots</h3>
            <p className="text-xs text-gray-400 mt-1">Acquire optimized bots & expert templates.</p>
          </div>
        </button>

        {/* Free Bots Store Card */}
        <button 
          onClick={() => setActiveTab('Free Bots')}
          className="bg-[#06122d] border border-blue-900/40 p-5 rounded-xl hover:border-blue-500/50 hover:bg-[#091b42]/80 transition-all text-left flex items-start gap-4 group cursor-pointer"
        >
          <div className="p-3 bg-emerald-950/40 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5 shadow-emerald-500/20" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-100">Free Bots</h3>
            <p className="text-xs text-gray-400 mt-1">Access immediate free strategies blocklists.</p>
          </div>
        </button>
      </div>

      {/* Real-time Signals Scanning Section */}
      <div className="max-w-6xl mx-auto select-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
            <h2 className="text-xl font-display font-bold tracking-tight text-white">Live Signals Scan</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-900/40 border border-blue-800 text-blue-300 rounded-full">ACTIVE</span>
          </div>

          {/* Quick-Filter Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search active scanning indices..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#06122d] border border-gray-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Signals Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="signals-grid">
          {filteredSignals.length > 0 ? (
            filteredSignals.map((sig) => (
              <div 
                key={sig.id} 
                className="bg-[#050e24] border border-blue-900/30 hover:border-blue-500/40 rounded-xl p-5 hover:shadow-lg hover:shadow-blue-950/30 transition-all relative overflow-hidden flex flex-col justify-between"
              >
                {/* Header info */}
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="font-mono text-sm font-bold text-gray-100 tracking-tight flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      #{sig.id} {sig.market}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase ${
                      sig.type === 'OVER' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                      sig.type === 'UNDER' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      sig.type === 'ODD' ? 'bg-pink-950 text-pink-300 border border-pink-800' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {sig.type} {sig.target}
                    </span>
                  </div>

                  {/* Conditions */}
                  <p className="text-xs text-[#94a3b8] leading-relaxed mb-4 font-normal bg-[#081535] p-3 rounded-lg border border-blue-950">
                    <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px] block mb-1">SCANNING CONDITION</span>
                    {sig.condition}
                  </p>

                  {/* Dynamic metrics values */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {sig.values.map((val, idx) => (
                      <div key={idx} className="bg-[#081535] px-3 py-2 rounded border border-gray-800/40 flex justify-between items-center text-xs">
                        <span className="text-gray-400">{val.key}:</span>
                        <span className="font-mono text-gray-100 font-bold">{val.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer and Launch parameters */}
                <div className="border-t border-gray-800/40 pt-3 flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 uppercase font-bold text-left tracking-wide">Signal Confidence</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-mono font-extrabold text-[#38bdf8]">{sig.confidence}%</span>
                        <div className="w-16 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#2563eb] h-full transition-all duration-700" 
                            style={{ width: `${sig.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleActionClick(sig)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-bold hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{sig.actionLabel}</span>
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-10 text-gray-500 bg-[#06122d] border border-gray-800 rounded-xl font-medium">
              No matching scanning indicators found for "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
