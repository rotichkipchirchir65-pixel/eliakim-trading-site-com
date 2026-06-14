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
import ManualTradingSection from './components/ManualTradingSection';
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

  // Deriv OAuth State
  const [derivAccounts, setDerivAccounts] = useState<{ account: string; token: string; cur: string }[]>(() => {
    try {
      const stored = localStorage.getItem('deriv_accounts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeDerivAcct, setActiveDerivAcct] = useState<string | null>(() => {
    return localStorage.getItem('deriv_active_acct');
  });

  const [derivAppId, setDerivAppId] = useState<string>(() => {
    return localStorage.getItem('deriv_app_id') || '33yjzVFBvxegoDiBsKb9K';
  });
  
  // Persistent WebSocket Ref to allow trades submission
  const wsRef = useState<WebSocket | null>(null); // simple container state
  const [liveWs, setLiveWs] = useState<WebSocket | null>(null);

  // Helper mapping functions
  const mapMarketToSymbol = (marketName: string): string => {
    const name = marketName.toLowerCase();
    if (name.includes('100 (1s)') || name.includes('100(1s)')) return '1HZ100V';
    if (name.includes('10 (1s)') || name.includes('10(1s)')) return '1HZ10V';
    if (name.includes('100')) return 'R_100';
    if (name.includes('75')) return 'R_75';
    if (name.includes('50')) return 'R_50';
    if (name.includes('25')) return 'R_25';
    if (name.includes('10')) return 'R_10';
    return 'R_100';
  };

  const mapContractType = (typeStr: string): string => {
    const str = typeStr.toLowerCase();
    if (str.includes('even')) return 'DIGITEVEN';
    if (str.includes('odd')) return 'DIGITODD';
    if (str.includes('differ')) return 'DIGITDIFF';
    if (str.includes('match')) return 'DIGITMATCH';
    if (str.includes('over')) return 'DIGITOVER';
    if (str.includes('under')) return 'DIGITUNDER';
    if (str.includes('rise') || str.includes('call') || str.includes('up')) return 'CALL';
    if (str.includes('fall') || str.includes('put') || str.includes('down')) return 'PUT';
    return 'DIGITEVEN';
  };

  const executeDerivTrade = (marketName: string, contractType: string, stake: number, duration: number = 1, durationUnit: string = 't'): boolean => {
    if (!activeDerivAcct) {
      addLog("Live Account Locked! Please log into your Deriv account in the header first to trade real markets.", "error");
      return false;
    }

    if (!liveWs || liveWs.readyState !== WebSocket.OPEN) {
      addLog("Active WebSocket with Deriv server is offline. Please authorize or reload.", "warning");
      return false;
    }

    const symbolCode = mapMarketToSymbol(marketName);
    const typeCode = mapContractType(contractType);
    const activeAcctObj = derivAccounts.find(a => a.account === activeDerivAcct);
    const activeCurrency = activeAcctObj?.cur || 'USD';

    addLog(`[Live trade command] Transmitting direct purchase sequence to Deriv API: ${symbolCode} (${typeCode}) stake: $${stake}...`, 'info');

    try {
      const orderPayload = {
        buy: 1,
        price: stake,
        parameters: {
          amount: stake,
          basis: 'stake',
          contract_type: typeCode,
          currency: activeCurrency,
          duration: duration,
          duration_unit: durationUnit,
          symbol: symbolCode
        }
      };

      liveWs.send(JSON.stringify(orderPayload));
      addLog(`[Live trade sent] Purchase request transmitted! Check reports list for execution status.`, 'success');
      return true;
    } catch (err: any) {
      addLog(`[Live trade submission error]: ${err?.message || err}`, 'error');
      return false;
    }
  };
  
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

  // React to transaction stream to update mock funds balances in real-time only if NO active live account exists
  useEffect(() => {
    if (transactions.length === 0) return;
    if (activeDerivAcct) return; // Do not use fake balances if real accounts are active
    const latestTx = transactions[transactions.length - 1];
    
    if (isDemo) {
      setDemoBalance((prev) => Math.max(0, prev + latestTx.profit));
    } else {
      setRealBalance((prev) => Math.max(0, prev + latestTx.profit));
    }
  }, [transactions, activeDerivAcct]);

  // Parse Deriv accounts from URL query on redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('acct1') && params.has('token1')) {
      const parsed: { account: string; token: string; cur: string }[] = [];
      let i = 1;
      while (params.has(`acct${i}`)) {
        parsed.push({
          account: params.get(`acct${i}`) || '',
          token: params.get(`token${i}`) || '',
          cur: params.get(`cur${i}`) || ''
        });
        i++;
      }

      if (parsed.length > 0) {
        setDerivAccounts(parsed);
        const firstReal = parsed.find(a => !a.account.startsWith('VRTC')) || parsed[0];
        setActiveDerivAcct(firstReal.account);
        localStorage.setItem('deriv_accounts', JSON.stringify(parsed));
        localStorage.setItem('deriv_active_acct', firstReal.account);
        setIsDemo(firstReal.account.startsWith('VRTC'));
        setUsername(firstReal.account);
        
        // Remove query parameters from Address bar
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        
        addLog(`Deriv OAuth Authenticated successfully! Loaded ${parsed.length} account(s). Active login: ${firstReal.account}`, 'success');
      }
    }
  }, []);

  // Sync balances and authorize active account with Deriv WS API
  useEffect(() => {
    if (!activeDerivAcct || derivAccounts.length === 0) return;
    const selectedAccount = derivAccounts.find(a => a.account === activeDerivAcct);
    if (!selectedAccount || !selectedAccount.token) return;

    addLog(`Establishing live WebSocket connection to Deriv API for ${activeDerivAcct}...`, 'info');

    const appID = derivAppId || '33yjzVFBvxegoDiBsKb9K';
    const wsUrl = `wss://ws.derivws.com/websockets/v3?app_id=${appID}&l=en`;
    
    let ws: WebSocket | null = null;
    let pingInterval: NodeJS.Timeout | null = null;

    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        // Log in to Deriv using the active token
        ws?.send(JSON.stringify({ authorize: selectedAccount.token }));
        setLiveWs(ws);
        
        // Setup simple heartbeat ping to keep connection alive
        pingInterval = setInterval(() => {
          if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ ping: 1 }));
          }
        }, 30000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.error) {
            addLog(`[Deriv API Error]: ${data.error.message || 'Verification failed.'}`, 'error');
            return;
          }
          
          if (data.msg_type === 'authorize') {
            const auth = data.authorize;
            addLog(`[Deriv Authorize] Connected to ${auth.loginid} (${auth.fullname || 'Verified Account'})`, 'success');
            
            const liveBal = Number(auth.balance || 0);
            if (activeDerivAcct.startsWith('VRTC')) {
              setDemoBalance(liveBal);
            } else {
              setRealBalance(liveBal);
            }
            
            // Subscribe to real-time balance ticks & live account transaction logs
            ws?.send(JSON.stringify({ balance: 1, subscribe: 1 }));
            ws?.send(JSON.stringify({ transaction: 1, subscribe: 1 }));
            addLog("Subscribed to live account transactions & updates.", "info");
          }
          
          if (data.msg_type === 'balance') {
            const bal = data.balance;
            const liveBal = Number(bal.balance || 0);
            if (activeDerivAcct.startsWith('VRTC')) {
              setDemoBalance(liveBal);
            } else {
              setRealBalance(liveBal);
            }
          }

          // Capture real transactions executed on the Deriv platform
          if (data.msg_type === 'transaction') {
            const tx = data.transaction;
            const liveTxId = 'TX-' + tx.contract_id;
            
            if (tx.action === 'buy') {
              addLog(`[Live Transacted] Contract of $${tx.amount} USD purchased on ${tx.symbol}.`, 'info');
              setTransactions((prev) => {
                if (prev.some(t => t.id === liveTxId)) return prev;
                return [
                  {
                    id: liveTxId,
                    time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                    type: 'Buy',
                    market: tx.symbol.replace('R_', 'Volatility ').replace('1HZ10V', 'Volatility 10 (1s) Index').replace('1HZ100V', 'Volatility 100 (1s) Index'),
                    stake: Number(tx.amount),
                    payout: 0,
                    profit: -Number(tx.amount),
                    status: 'pending',
                    contractType: tx.longcode ? tx.longcode.split(' ')[0] + ' Option' : 'Live Option'
                  },
                  ...prev
                ];
              });
            } else if (tx.action === 'sell') {
              const profitColor = Number(tx.amount) > 0;
              addLog(`[Live Resolution] Contract ${tx.contract_id} completed. Yield: $${tx.amount} USD.`, profitColor ? 'success' : 'error');
              
              setTransactions((prev) => {
                const updated = [...prev];
                const targetIdx = updated.findIndex(t => t.id === liveTxId);
                
                if (targetIdx !== -1) {
                  const buyTx = updated[targetIdx];
                  const actualPayout = Number(tx.amount);
                  updated[targetIdx] = {
                    ...buyTx,
                    payout: actualPayout,
                    profit: parseFloat((actualPayout - buyTx.stake).toFixed(2)),
                    status: actualPayout > 0 ? 'won' : 'lost'
                  };
                } else {
                  // Fallback if buy event was missed
                  updated.unshift({
                    id: liveTxId,
                    time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                    type: 'Buy',
                    market: tx.symbol.replace('R_', 'Volatility '),
                    stake: Number(tx.amount) > 0 ? Number((tx.amount / 1.9).toFixed(2)) : 0.5,
                    payout: Number(tx.amount),
                    profit: Number(tx.amount) > 0 ? Number((tx.amount - 0.5).toFixed(2)) : -0.5,
                    status: Number(tx.amount) > 0 ? 'won' : 'lost',
                    contractType: 'Live Option'
                  });
                }
                return updated;
              });
            }
          }
        } catch (err) {
          console.error("Websocket parse error:", err);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket connection error:", err);
      };

      ws.onclose = () => {
        setLiveWs(null);
        if (pingInterval) clearInterval(pingInterval);
      };
    } catch (err) {
      console.error("Cannot load Websocket:", err);
    }

    return () => {
      if (ws) ws.close();
      if (pingInterval) clearInterval(pingInterval);
    };
  }, [activeDerivAcct, derivAccounts, derivAppId]);

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

  const handleClearDerivAccounts = () => {
    setDerivAccounts([]);
    setActiveDerivAcct(null);
    localStorage.removeItem('deriv_accounts');
    localStorage.removeItem('deriv_active_acct');
    setUsername('ROT91864236');
    setIsDemo(true);
    addLog("Disconnected Deriv real account from active memory.", "warning");
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
        derivAccounts={derivAccounts}
        activeDerivAcct={activeDerivAcct}
        setActiveDerivAcct={(acct) => {
          setActiveDerivAcct(acct);
          localStorage.setItem('deriv_active_acct', acct);
          const selected = derivAccounts.find(a => a.account === acct);
          setIsDemo(acct.startsWith('VRTC'));
          if (selected) {
            setUsername(selected.account);
            addLog(`Switched active Deriv account to key context: ${acct}`, 'info');
          }
        }}
        derivAppId={derivAppId}
        setDerivAppId={(appId) => {
          setDerivAppId(appId);
          localStorage.setItem('deriv_app_id', appId);
        }}
        onClearDerivAccounts={handleClearDerivAccounts}
        addLog={addLog}
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
              isLiveConnected={activeDerivAcct !== null}
              executeDerivTrade={executeDerivTrade}
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
              isLiveConnected={activeDerivAcct !== null}
              executeDerivTrade={executeDerivTrade}
            />
          )}

          {activeTab === 'Ultimate Bot' && (
            <UltimateBotTab 
              addLog={addLog}
              addTransaction={addTransaction}
              botConfig={botConfig}
              setBotConfig={setBotConfig}
              isLiveConnected={activeDerivAcct !== null}
              executeDerivTrade={executeDerivTrade}
            />
          )}

          {activeTab === 'DTrader' && (
            <DTraderTab 
              addLog={addLog}
              addTransaction={addTransaction}
              isLiveConnected={activeDerivAcct !== null}
              executeDerivTrade={executeDerivTrade}
            />
          )}

          {/* 4. Elegant fallbacks for peripheral tabs requested/displayed in nav tape */}
          {activeTab === 'Manual Trading' && (
            <ManualTradingSection 
              addLog={addLog}
              addTransaction={addTransaction}
              isLiveConnected={activeDerivAcct !== null}
              executeDerivTrade={executeDerivTrade}
            />
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
