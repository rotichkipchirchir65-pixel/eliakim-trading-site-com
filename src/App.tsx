import { useState, useEffect } from 'react';
import Header from './components/Header';
import NavigationTape from './components/NavigationTape';
import DashboardTab from './components/DashboardTab';
import BotBuilderTab from './components/BotBuilderTab';
import AnalysistoolsTab from './components/AnalysistoolsTab';
import FreeBotsTab from './components/FreeBotsTab';
import ProAITab from './components/ProAITab';
import AutoTraderTab from './components/AutoTraderTab';
import UltimateBotTab from './components/UltimateBotTab';
import DTraderTab from './components/DTraderTab';
import SidebarSummary from './components/SidebarSummary';
import AICompanion from './components/AICompanion';
import FooterStatus from './components/FooterStatus';

import { TabType, Transaction, JournalLog, BotConfig, MarketSignal } from './types';
import { 
  Users, 
  GraduationCap, 
  Zap, 
  LineChart, 
  Hand,
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  Share2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('Dashboard');
  const [isDemo, setIsDemo] = useState(true);
  const [demoBalance, setDemoBalance] = useState(10000.00);
  const [realBalance, setRealBalance] = useState(250.00);
  const [username, setUsername] = useState('ROT91864236');
  
  // UI Panels toggles
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isAiOpen, setAiOpen] = useState(false);
  const [botSpeedSetting, setBotSpeedSetting] = useState<'slow' | 'fast'>('slow');

  // Transactions / Log lists with interactive seeds
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TX-836102',
      time: '14:32:05',
      type: 'Buy',
      market: 'Volatility 100 Index',
      stake: 0.50,
      payout: 0.96,
      profit: 0.46,
      status: 'won',
      contractType: 'Even Digit'
    },
    {
      id: 'TX-291774',
      time: '14:31:12',
      type: 'Buy',
      market: 'Volatility 75 Index',
      stake: 1.00,
      payout: 0.00,
      profit: -1.00,
      status: 'lost',
      contractType: 'Odd Digit'
    }
  ]);

  const [journalLogs, setJournalLogs] = useState<JournalLog[]>([
    { id: '1', time: '14:30:00', message: 'BinaryTool engine loaded.', type: 'info' },
    { id: '2', time: '14:30:02', message: 'Secured RPC sockets with synthetic ticks index server.', type: 'success' },
    { id: '3', time: '14:31:12', message: 'Order contract resolved lost (1.00 USD). Entry bias: High Odd.', type: 'error' },
    { id: '4', time: '14:32:05', message: 'Order contract resolved won (0.96 USD). Entry bias: High Even.', type: 'success' },
  ]);

  // Global bot parameters
  const [botConfig, setBotConfig] = useState<BotConfig>({
    initialTradeType: 'Rise / Fall (Rise Only)',
    recoveryType: 'Martingale Basic',
    lastNTicks: 3,
    stake: 0.5,
    tp: 5.0,
    sl: 30.0,
    enableMartingale: true,
    martingaleMultiplier: 2.0
  });

  // Calculate current active balance depending on mode
  const currentBalance = isDemo ? demoBalance : realBalance;

  // React to transaction stream to update mock funds balances in real-time
  useEffect(() => {
    if (transactions.length === 0) return;
    const latestTx = transactions[transactions.length - 1];
    
    // Check if duplicate of last record to avoid re-adding
    if (isDemo) {
      setDemoBalance((prev) => Math.max(0, prev + latestTx.profit));
    } else {
      setRealBalance((prev) => Math.max(0, prev + latestTx.profit));
    }
  }, [transactions]);

  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning') => {
    const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    setJournalLogs((prev) => [
      ...prev,
      {
        id: String(prev.length + 100 + Math.floor(Math.random() * 100)),
        time: nowStr,
        message,
        type
      }
    ]);
  };

  const addTransaction = (tx: Transaction) => {
    setTransactions((prev) => [...prev, tx]);
  };

  const handleResetBalance = () => {
    if (isDemo) {
      setDemoBalance(10000.00);
      addLog("Simulated Demo Balance replenished to 10,000.00 USD.", "success");
    } else {
      setRealBalance(500.00);
      addLog("Simulated Real Account credited with $500.00 trial funds.", "info");
    }
  };

  // Preset loaders for the shop
  const handleLoadPresetConfig = (preset: any) => {
    setBotConfig({
      initialTradeType: preset.botName,
      recoveryType: preset.enableMartingale ? 'Martingale Basic' : 'No Recovery (Flat)',
      lastNTicks: preset.lastNTicks || 3,
      stake: preset.stake || 0.5,
      tp: preset.tp || 5.0,
      sl: preset.sl || 30.0,
      enableMartingale: preset.enableMartingale,
      martingaleMultiplier: preset.martingaleMultiplier || 2.0
    });
  };

  // Live signal integration
  const handleLoadSignalToBot = (signal: MarketSignal) => {
    setBotConfig({
      initialTradeType: `${signal.market} (${signal.type})`,
      recoveryType: 'Martingale Basic',
      lastNTicks: 4,
      stake: 0.5,
      tp: 6.0,
      sl: 25.0,
      enableMartingale: true,
      martingaleMultiplier: 2.1
    });
  };

  // Speedbot wizard states
  const [speedbotMkt, setSpeedbotMkt] = useState('Volatility 100 Index');
  const [speedbotDir, setSpeedbotDir] = useState('Matches');
  const [speedbotStake, setSpeedbotStake] = useState(1.0);

  const handleCompileSpeedbot = () => {
    addLog(`Rapid compile active: Speedbot target indexed on ${speedbotMkt} (${speedbotDir})...`, 'info');
    setTimeout(() => {
      addLog("Speedbot successfully compiled! Operational presets pushed to active memory channels.", "success");
      setBotConfig({
        initialTradeType: `SpeedBot: ${speedbotDir}`,
        recoveryType: 'Martingale Basic',
        lastNTicks: 3,
        stake: speedbotStake,
        tp: 10.0,
        sl: 50.0,
        enableMartingale: true,
        martingaleMultiplier: 2.0
      });
      setActiveTab('Ultimate Bot');
    }, 1100);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 text-gray-900" id="app-root-frame">
      
      {/* 1. Header Row */}
      <Header 
        balance={currentBalance}
        isDemo={isDemo}
        setIsDemo={setIsDemo}
        onResetBalance={handleResetBalance}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setAiOpen={setAiOpen}
        username={username}
        setUsername={setUsername}
      />

      {/* 2. Horizontal Navigation tape linking pages */}
      <NavigationTape 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 3. Main Stage Content Area nested alongside side stats drawers */}
      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 overflow-y-auto min-w-0" id="tab-viewport-parent">
          
          {activeTab === 'Dashboard' && (
            <DashboardTab 
              username={username}
              setActiveTab={setActiveTab}
              addLog={addLog}
              loadSignalToBot={handleLoadSignalToBot}
            />
          )}

          {activeTab === 'Bot Builder' && (
            <BotBuilderTab 
              addLog={addLog}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'Analysistools' && (
            <AnalysistoolsTab 
              addLog={addLog}
              addTransaction={addTransaction}
            />
          )}

          {activeTab === 'Free Bots' && (
            <FreeBotsTab 
              addLog={addLog}
              setActiveTab={setActiveTab}
              loadPresetConfig={handleLoadPresetConfig}
            />
          )}

          {activeTab === 'Pro AI' && (
            <ProAITab 
              addLog={addLog}
            />
          )}

          {activeTab === 'Auto Trader' && (
            <AutoTraderTab 
              addLog={addLog}
              addTransaction={addTransaction}
            />
          )}

          {activeTab === 'Ultimate Bot' && (
            <UltimateBotTab 
              addLog={addLog}
              addTransaction={addTransaction}
              botConfig={botConfig}
              setBotConfig={setBotConfig}
            />
          )}

          {activeTab === 'DTrader' && (
            <DTraderTab 
              addLog={addLog}
              addTransaction={addTransaction}
            />
          )}

          {/* 4. Elegant fallbacks for peripheral tabs requested/displayed in nav tape */}
          {activeTab === 'Manual Trading' && (
            <div className="p-6 bg-gray-100 min-h-full flex items-center justify-center font-sans">
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md max-w-lg w-full">
                <div className="flex items-center gap-3 border-b border-gray-150 pb-4 mb-4 select-none">
                  <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                    <Hand className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-800 text-lg leading-normal">Manual Position Taker</h2>
                    <p className="text-xs text-gray-400">Order execution directly below custom synthetic ticks.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5 text-xs">
                    <span className="text-gray-500 font-bold">Select Volatility Index:</span>
                    <select className="bg-gray-50 border border-gray-200 rounded p-2.5 font-bold focus:outline-none focus:bg-white text-gray-800 cursor-pointer">
                      <option>Volatility 100 Index</option>
                      <option>Volatility 10 (1s) Index</option>
                      <option>Volatility 75 Index</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-gray-500 font-bold">Stake USD:</span>
                      <input type="number" defaultValue="1.0" className="bg-gray-50 border border-gray-200 rounded p-2 text-xs font-mono font-bold focus:outline-none" />
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-gray-500 font-bold">Duration (Ticks or Secs):</span>
                      <input type="number" defaultValue="5" className="bg-gray-50 border border-gray-200 rounded p-2 text-xs font-mono font-bold focus:outline-none" />
                    </div>
                  </div>

                  <div className="bg-blue-50/50 p-3 rounded-lg text-[11px] text-blue-900 border border-blue-100">
                    💡 Perfect for trading breakouts manually while your background Bots scan other continuous indexes in parallel!
                  </div>

                  <button
                    onClick={() => {
                      addLog("Manual Contract initiated. Position processing...", "info");
                      setTimeout(() => {
                        const win = Math.random() > 0.50;
                        const rand = Math.floor(100000 + Math.random() * 900000);
                        addTransaction({
                          id: 'TX-' + rand,
                          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                          type: 'Buy',
                          market: 'Volatility 100 Index (Manual)',
                          stake: 1.0,
                          payout: win ? 1.95 : 0,
                          profit: win ? 0.95 : -1.0,
                          status: win ? 'won' : 'lost',
                          contractType: 'Manual Option'
                        });
                        addLog(`Manual contract processed: ${win ? 'WON (+$0.95)' : 'LOST (-$1.00)'}`, win ? 'success' : 'error');
                      }, 800);
                    }}
                    className="w-full py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    Expressed Purchase Order
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Speedbot' && (
            <div className="p-6 bg-[#020b1e] min-h-full flex items-center justify-center font-sans text-white">
              <div className="bg-[#050e24] border border-blue-950/85 p-8 rounded-3xl max-w-lg w-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex items-center gap-3 border-b border-gray-800 pb-4 mb-5 select-none">
                  <div className="p-2.5 bg-amber-950 text-amber-500 rounded-lg animate-pulse">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-100 text-lg leading-tight font-display">SpeedBot Strategy Wizard</h2>
                    <p className="text-xs text-gray-400">Generate a custom option bot in three clicks.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="text-gray-400 uppercase tracking-wider font-bold">1. TARGET MARKET:</span>
                    <select 
                      value={speedbotMkt}
                      onChange={(e) => setSpeedbotMkt(e.target.value)}
                      className="bg-[#081535] border border-blue-900 rounded p-2.5 text-xs text-gray-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option>Volatility 100 Index</option>
                      <option>Volatility 75 Index</option>
                      <option>Volatility 25 Index</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1 text-xs">
                    <span className="text-gray-400 uppercase tracking-wider font-bold">2. DIRECT LOGIC BOUNDS:</span>
                    <select 
                      value={speedbotDir}
                      onChange={(e) => setSpeedbotDir(e.target.value)}
                      className="bg-[#081535] border border-blue-900 rounded p-2.5 text-xs text-gray-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Matches">Digit Matches / Differs anomalies</option>
                      <option value="Even/Odd Toggle">Parity Even/Odd sequence switch</option>
                      <option value="Breakout Run">High/Low Candlestick drift checks</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs">
                    <span className="text-gray-400 uppercase tracking-wider font-bold">3. BASE STAKE AMOUNT:</span>
                    <input 
                      type="number" 
                      value={speedbotStake}
                      onChange={(e) => setSpeedbotStake(Math.max(0.1, Number(e.target.value)))}
                      className="bg-[#081535] border border-blue-900 rounded p-2.5 text-xs text-gray-200 font-mono font-bold focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleCompileSpeedbot}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-black uppercase transition-all shadow-lg hover:shadow-amber-500/10 mt-3 cursor-pointer"
                  >
                    Compile & Push to Ultimate Bot
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Chart' && (
            <div className="p-6 bg-gray-100 min-h-full font-sans">
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm max-w-4xl mx-auto">
                <div className="flex justify-between items-center border-b border-gray-150 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-indigo-600" />
                    <h2 className="font-bold text-gray-800 text-base leading-none">Vigilant Market Indicators</h2>
                  </div>
                  <span className="text-[10px] bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded text-indigo-700 font-mono font-bold">INDEX MODE</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-xs text-gray-600 select-none">
                  <div className="bg-gray-50 p-4 border border-gray-200 rounded-xl space-y-1">
                    <span className="text-gray-400 block font-bold">RELATIVE STRENGTH (RSI)</span>
                    <span className="text-base font-mono font-black text-gray-800 block">58.45</span>
                    <span className="text-[10px] text-emerald-600">● Stable consolidation</span>
                  </div>
                  <div className="bg-gray-50 p-4 border border-gray-200 rounded-xl space-y-1">
                    <span className="text-gray-400 block font-bold">BOLLINGER WIDTH</span>
                    <span className="text-base font-mono font-black text-gray-800 block">±12.4%</span>
                    <span className="text-[10px] text-blue-500">○ Moderate width expansion</span>
                  </div>
                  <div className="bg-gray-50 p-4 border border-gray-200 rounded-xl space-y-1">
                    <span className="text-gray-400 block font-bold">EMA (12, 26) CROSSOVER</span>
                    <span className="text-base font-mono font-black text-gray-800 block">BULLISH</span>
                    <span className="text-[10px] text-emerald-600">▲ Strong momentum bias</span>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-xs leading-relaxed text-indigo-950 font-medium">
                  📈 <strong>Charting parameters synced:</strong> Real-time streaming chart views are accessible inside the <strong>DTrader and DCIRCLE tabs</strong> to facilitate active option clicks. Toggle over to DTrader to execute trades on live compounding graphs!
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Copy Trading' && (
            <div className="p-6 bg-gray-50 min-h-full font-sans">
              <div className="max-w-4xl mx-auto space-y-6">
                
                <div className="border-b border-gray-250 pb-3">
                  <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                    <Users className="w-5.5 h-5.5 text-blue-900" />
                    Copy-Trading Expert Boards
                  </h2>
                  <p className="text-xs text-gray-400">Replicate transactions of optimized professional options providers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Trader #1 */}
                  <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-sm text-gray-800">Binary Wizard 🧙‍♂️</span>
                        <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-100">WIN: 92%</span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">Specializes in rapid 1-tick digit-differ systems with tight Stop Loss boundaries on speed indices.</p>
                    </div>
                    <button 
                      onClick={() => {
                        addLog("Connected stream to: Binary Wizard. Following active differ positions...", "success");
                      }}
                      className="w-full mt-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      Copy Logic Now
                    </button>
                  </div>

                  {/* Trader #2 */}
                  <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-sm text-gray-800">Digits Sniper 🎯</span>
                        <span className="text-[9px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-100">WIN: 88%</span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">Uses 100-tick lookback percentage triggers to automatically catch Over 4 / Under 5 market breakouts.</p>
                    </div>
                    <button 
                      onClick={() => {
                        addLog("Connected stream to: Digits Sniper. Following dynamic percentage targets...", "success");
                      }}
                      className="w-full mt-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      Copy Logic Now
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'Deriv Course' && (
            <div className="p-6 bg-gray-50 min-h-full font-sans">
              <div className="max-w-3xl mx-auto space-y-6">
                
                <div className="border-b border-gray-250 pb-3">
                  <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                    <GraduationCap className="w-6.5 h-6.5 text-blue-900" />
                    Deriv Automations Course
                  </h2>
                  <p className="text-xs text-gray-400 font-medium">Free structured material explaining synthetics index patterns and bots setup.</p>
                </div>

                <div className="space-y-4">
                  {/* Lesson 1 */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-start gap-4 hover:shadow-sm transition-all shadow-sm">
                    <div className="p-2.5 bg-blue-50 text-blue-900 rounded-lg font-bold font-mono text-sm leading-none flex-shrink-0">
                      01
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-800">Intro to Synthetics Index</h3>
                      <p className="text-xs text-gray-500 mt-1">Learn how continuous synthetic options represent true generated ticks, and understand uniform probability parameters.</p>
                    </div>
                  </div>

                  {/* Lesson 2 */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-start gap-4 hover:shadow-sm transition-all shadow-sm">
                    <div className="p-2.5 bg-blue-50 text-blue-900 rounded-lg font-bold font-mono text-sm leading-none flex-shrink-0">
                      02
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-800">Parity & Martingale Mechanics</h3>
                      <p className="text-xs text-gray-500 mt-1">Understand streaks deviations on Even and Odd types. Learn why stop loss points are vital during multi-runs.</p>
                    </div>
                  </div>

                  {/* Lesson 3 */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-start gap-4 hover:shadow-sm transition-all shadow-sm">
                    <div className="p-2.5 bg-blue-50 text-blue-900 rounded-lg font-bold font-mono text-sm leading-none flex-shrink-0">
                      03
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-800">XML Custom Block Construction</h3>
                      <p className="text-xs text-gray-500 mt-1">Deep analysis on custom block conditions in Bot Builder, using variable loops to trigger contract resales.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>

        {/* 5. Right split statistics reports sidebar */}
        <SidebarSummary 
          transactions={transactions}
          journalLogs={journalLogs}
          onClearTransactions={() => {
            setTransactions([]);
            addLog("Cleared transactions history database log.", "warning");
          }}
          onClearLogs={() => setJournalLogs([])}
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* 6. Static diagnostic footer logs info */}
      <FooterStatus 
        isAnyBotRunning={false} // Managed locally
        botSpeedSetting={botSpeedSetting}
        setBotSpeedSetting={setBotSpeedSetting}
        transactionsCount={transactions.length}
      />

      {/* 7. Floating Interactive generative AI strategic assistant */}
      <AICompanion 
        isAiOpen={isAiOpen}
        setAiOpen={setAiOpen}
        addLog={addLog}
      />

    </div>
  );
}
