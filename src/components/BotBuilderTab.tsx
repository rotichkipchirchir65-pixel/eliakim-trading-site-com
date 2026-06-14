import { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  RotateCcw, 
  RotateCw, 
  Plus, 
  Minus, 
  Play, 
  Trash2, 
  RefreshCcw,
  Settings,
  HelpCircle,
  Eye,
  Info
} from 'lucide-react';
import { TabType } from '../types';

interface BotBuilderProps {
  addLog: (msg: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  setActiveTab: (tab: TabType) => void;
}

export default function BotBuilderTab({ addLog, setActiveTab }: BotBuilderProps) {
  const [searchBlock, setSearchBlock] = useState('');
  const [expandedMenu, setExpandedMenu] = useState<string>('Trade parameters');
  
  // Interactive Block States
  const [market, setMarket] = useState('Volatility 100 (1s) Index');
  const [tradeType, setTradeType] = useState('Rise/Fall');
  const [contractType, setContractType] = useState('Both');
  const [ticks, setTicks] = useState(1);
  const [stake, setStake] = useState(1.0);
  const [restartOnError, setRestartOnError] = useState(true);
  const [purchaseAction, setPurchaseAction] = useState('Rise');

  // Menus in the sidebar
  const blockMenus = [
    { name: 'Analysis Logics 🔥', bg: 'text-orange-500' },
    { name: 'Trade parameters', bg: 'text-blue-500' },
    { name: 'Purchase conditions', bg: 'text-teal-500' },
    { name: 'Sell conditions (optional)', bg: 'text-purple-500' },
    { name: 'Restart trading conditions', bg: 'text-blue-600' },
    { name: 'Analysis', bg: 'text-gray-500' },
    { name: 'Utility', bg: 'text-green-500' },
    { name: 'Virtual Hook Switcher', bg: 'text-pink-500' },
    { name: 'Custom Notification', bg: 'text-[#8b5cf6]' },
    { name: 'Binarytools', bg: 'text-indigo-400' },
    { name: 'Contract modifiers', bg: 'text-[#e11d48]' },
  ];

  const handleRunBot = () => {
    addLog(`Initiating trade bot compiler for strategy: Volatility trading on ${market}...`, 'info');
    setTimeout(() => {
      addLog(`Compilation successful! Bot is now executing. Mode: ${tradeType}, Ticks: ${ticks}, Stake: $${stake}`, 'success');
      setActiveTab('Ultimate Bot');
    }, 1100);
  };

  const handleResetWorkspace = () => {
    setMarket('Volatility 100 (1s) Index');
    setTradeType('Rise/Fall');
    setContractType('Both');
    setTicks(1);
    setStake(1.0);
    setRestartOnError(true);
    setPurchaseAction('Rise');
    addLog('Restored initial Blockly workspace state.', 'warning');
  };

  const handleExportXML = () => {
    addLog('Generating raw strategy XML template...', 'info');
    setTimeout(() => {
      addLog('XML structure generated! Click reports or open terminal to fetch direct binaries.', 'success');
    }, 800);
  };

  const toggleMenu = (name: string) => {
    if (expandedMenu === name) {
      setExpandedMenu('');
    } else {
      setExpandedMenu(name);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col md:flex-row min-h-[calc(100vh-120px)] text-gray-800 select-none font-sans" id="bot-builder-panel">
      {/* 1. Left Accordion Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0" id="block-drawer">
        <div className="p-3 bg-blue-900 text-white flex items-center justify-between text-xs font-bold leading-none uppercase tracking-wide">
          <span>Blocks menu</span>
          <button 
            type="button"
            onClick={() => setActiveTab('Speedbot')}
            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] uppercase font-bold transition-all cursor-pointer"
          >
            Quick strategy
          </button>
        </div>

        {/* Search filter */}
        <div className="p-3 border-b border-gray-100 relative">
          <Search className="w-3.5 h-3.5 absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchBlock}
            onChange={(e) => setSearchBlock(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 pl-8 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Scrollable accordions */}
        <div className="flex-1 overflow-y-auto text-xs font-medium" id="blocks-accordion-area">
          {blockMenus
            .filter((menu) => menu.name.toLowerCase().includes(searchBlock.toLowerCase()))
            .map((menu) => {
              const works = expandedMenu === menu.name;
              return (
                <div key={menu.name} className="border-b border-gray-100">
                  <button
                    onClick={() => toggleMenu(menu.name)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 text-left text-gray-700 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${menu.bg.replace('text-', 'bg-')}`}></span>
                      {menu.name}
                    </span>
                    {works ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>

                  {/* Sub content (showing mock Block selections to drag) */}
                  {works && (
                    <div className="bg-gray-50/70 p-2.5 px-4 text-[11px] flex flex-col gap-1.5 border-t border-gray-100/50">
                      <div className="p-2 bg-blue-100 border-l-4 border-blue-500 rounded text-blue-800 font-mono flex items-center justify-between hover:bg-blue-200 cursor-grab active:cursor-grabbing">
                        <span>Get Market Option</span>
                        <Plus className="w-3 h-3 text-blue-500" />
                      </div>
                      <div className="p-2 bg-teal-100 border-l-4 border-teal-500 rounded text-teal-800 font-mono flex items-center justify-between hover:bg-teal-200 cursor-grab active:cursor-grabbing">
                        <span>Calculate Digit</span>
                        <Plus className="w-3 h-3 text-teal-500" />
                      </div>
                      <div className="p-2 bg-purple-100 border-l-4 border-purple-500 rounded text-purple-800 font-mono flex items-center justify-between hover:bg-purple-200 cursor-grab active:cursor-grabbing">
                        <span>Alert operator</span>
                        <Plus className="w-3 h-3 text-purple-500" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* 2. Main Blockly Workspace Canvas */}
      <div className="flex-1 flex flex-col relative" id="blockly-workspace-stage">
        {/* Workspace Controls Header */}
        <div className="bg-white border-b border-gray-200 h-11 px-4 flex items-center justify-between flex-shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleResetWorkspace}
              title="Reset Work space" 
              className="p-1.5 hover:bg-gray-100 rounded text-gray-500 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button title="Redo" className="p-1.5 hover:bg-gray-100 rounded text-gray-300 cursor-default" disabled>
              <RotateCw className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-gray-200 mx-1"></div>
            <button 
              onClick={handleExportXML}
              title="Show Strategy XML"
              className="px-2.5 py-1 text-xs font-semibold text-gray-600 border border-gray-200 rounded hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-gray-400" />
              <span>Show XML</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunBot}
              className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Compile & Run</span>
            </button>
          </div>
        </div>

        {/* Real Blockly Grid Canvas area */}
        <div className="flex-1 bg-white relative blockly-canvas-dots overflow-auto p-6" id="blockly-drop-arena">
          {/* Instructions banner */}
          <div className="max-w-xl mx-auto mb-6 bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-start gap-2 text-xs text-blue-800">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold">Developer Tooltip:</span> Double-click any puzzle block to inspect arguments, or drag dropdown menus to configure strategy boundaries directly in real time.
            </div>
          </div>

          {/* Block puzzle lists */}
          <div className="flex flex-col gap-6 max-w-4xl">
            {/* Block #1: Trade Parameters */}
            <div className="bg-[#1e40af] text-white rounded-xl shadow-md border-l-8 border-amber-500 w-full md:max-w-2xl overflow-hidden transition-all hover:shadow-lg">
              <div className="p-3.5 bg-blue-900 border-b border-blue-800 flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-2">
                  <span className="bg-amber-500 text-amber-950 font-bold px-1.5 py-0.5 rounded text-[10px]">FIXED</span>
                  <span>1. Trade parameters block</span>
                </span>
                <HelpCircle className="w-4 h-4 text-blue-300 hover:text-white cursor-help" />
              </div>

              <div className="p-4 space-y-4 text-xs font-semibold">
                {/* Market configuration */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-blue-800 pb-3">
                  <span className="text-blue-100">Market Segment:</span>
                  <div className="flex items-center bg-blue-950/70 border border-blue-800 rounded px-2 py-1 gap-1.5">
                    <span className="text-blue-400 font-mono text-[10px]">synthetic_index &gt; random_index &gt;</span>
                    <select
                      value={market}
                      onChange={(e) => setMarket(e.target.value)}
                      className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
                    >
                      <option className="bg-[#0f224a]" value="Volatility 100 (1s) Index">Volatility 100 (1s) Index</option>
                      <option className="bg-[#0f224a]" value="Volatility 75 Index">Volatility 75 Index</option>
                      <option className="bg-[#0f224a]" value="Volatility 50 (1s) Index">Volatility 50 (1s) Index</option>
                      <option className="bg-[#0f224a]" value="Volatility 10 Index">Volatility 10 Index</option>
                    </select>
                  </div>
                </div>

                {/* Alternate markets */}
                <div className="flex items-center gap-2 text-blue-100 select-none pb-1">
                  <input type="checkbox" id="alt-mkts" className="rounded text-blue-600 bg-blue-950 focus:ring-0 border-blue-800 cursor-pointer" />
                  <label htmlFor="alt-mkts" className="cursor-pointer">Alternate markets: Continuous Indices only (run every 1 runs).</label>
                </div>

                {/* Simultaneous switch & Virtual Hook */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 border-t border-blue-800/50 pt-3">
                  <div className="flex items-center gap-2 select-none text-blue-100">
                    <input type="checkbox" id="simul-scan" className="rounded text-blue-600 border-blue-800 bg-blue-950 focus:ring-0 cursor-pointer" />
                    <label htmlFor="simul-scan" className="cursor-pointer">Multi-scan simultaneously</label>
                  </div>

                  {/* Virtual Hook trigger button with popup mock */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-blue-300 font-mono uppercase">Virtual offset:</span>
                    <button 
                      onClick={() => addLog("Virtual Hook setting toggled to PRE-SCAN_OFFS=3", "info")}
                      className="bg-red-500 hover:bg-red-600 text-[10.5px] px-2.5 py-1 text-white font-bold rounded-md cursor-pointer transition-all uppercase shadow-sm"
                    >
                      VH Settings
                    </button>
                  </div>
                </div>

                {/* Trade Type, contract type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-blue-800/50 pt-3.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-blue-200 text-[11px]">Trade Type Option:</span>
                    <select
                      value={tradeType}
                      onChange={(e) => {
                        setTradeType(e.target.value);
                        addLog(`Block Updated: trade type toggled to ${e.target.value}`, "info");
                      }}
                      className="bg-blue-950 hover:bg-blue-900 border border-blue-800 text-white font-bold text-xs p-1.5 px-2 rounded-md focus:outline-none cursor-pointer"
                    >
                      <option value="Rise/Fall">Up/Down &gt; Rise/Fall</option>
                      <option value="Match/Differ">Digits &gt; Match/Differ</option>
                      <option value="Even/Odd">Digits &gt; Even/Odd</option>
                      <option value="Over/Under">Digits &gt; Over/Under</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-blue-200 text-[11px]">Contract Type:</span>
                    <select
                      value={contractType}
                      onChange={(e) => setContractType(e.target.value)}
                      className="bg-blue-950 hover:bg-blue-900 border border-blue-800 text-white font-bold text-xs p-1.5 px-2 rounded-md focus:outline-none cursor-pointer"
                    >
                      <option value="Both">Both</option>
                      <option value="Rise Only">Rise Only</option>
                      <option value="Fall Only">Fall Only</option>
                    </select>
                  </div>
                </div>

                {/* Duration ticks & Stake */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-blue-800/50 pt-3.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-blue-200 text-[11px]">Duration parameters:</span>
                    <div className="flex items-center gap-1.5">
                      <select className="bg-blue-950 border border-blue-800 text-white font-bold text-xs p-1.5 rounded-md focus:outline-none flex-1 cursor-pointer">
                        <option value="Ticks">Ticks</option>
                        <option value="Seconds">Seconds</option>
                        <option value="Minutes">Minutes</option>
                      </select>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={ticks}
                        onChange={(e) => setTicks(Number(e.target.value))}
                        className="bg-blue-950 border border-blue-800 font-mono text-center text-white text-xs font-bold p-1.5 rounded-md w-14 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-blue-200 text-[11px]">Stake amount:</span>
                    <div className="flex items-center bg-blue-950 border border-blue-800 rounded-md p-1.5 pr-2 gap-1.5">
                      <span className="text-[10px] text-blue-400 font-mono">USD</span>
                      <input
                        type="number"
                        value={stake}
                        step="0.5"
                        onChange={(e) => setStake(Math.max(0.1, Number(e.target.value)))}
                        className="bg-transparent text-white font-mono font-bold text-xs focus:outline-none w-full border-none h-auto p-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Restart last trade on error */}
                <div className="flex items-center gap-2 text-blue-100 border-t border-blue-800/50 pt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="restart-on-err"
                    checked={restartOnError}
                    onChange={(e) => setRestartOnError(e.target.checked)}
                    className="rounded text-blue-800 border-blue-800 bg-blue-950 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="restart-on-err" className="cursor-pointer">Restart last trade on error (bot ignores the failed strategy attempts)</label>
                </div>
              </div>
            </div>

            {/* Block #2: Purchase Conditions */}
            <div className="bg-[#14b8a6] text-white rounded-xl shadow-md border-l-8 border-indigo-500 w-full md:max-w-md overflow-hidden transition-all hover:shadow-lg">
              <div className="p-2.5 bg-teal-800 border-b border-teal-700 flex items-center justify-between text-xs font-mono">
                <span>2. Purchase conditions block</span>
                <Plus className="w-3.5 h-3.5 text-teal-300" />
              </div>
              <div className="p-4 flex items-center justify-between text-xs">
                <span className="text-teal-100 font-bold">Execution Action:</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-teal-300 font-mono">Purchase</span>
                  <select 
                    value={purchaseAction}
                    onChange={(e) => setPurchaseAction(e.target.value)}
                    className="bg-teal-950 hover:bg-teal-900 border border-teal-700 text-white font-bold p-1 px-3 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer"
                  >
                    <option value="Rise">Rise</option>
                    <option value="Fall">Fall</option>
                    <option value="Match">Match</option>
                    <option value="Differ">Differ</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Block #3: Sell Conditions */}
            <div className="bg-[#a855f7] text-white rounded-xl shadow-md border-l-8 border-pink-500 w-full md:max-w-md overflow-hidden transition-all hover:shadow-lg">
              <div className="p-2.5 bg-purple-900 border-b border-purple-800 flex items-center justify-between text-xs font-mono">
                <span>3. Sell conditions (optional)</span>
                <HelpCircle className="w-3.5 h-3.5 text-purple-300" />
              </div>
              <div className="p-4 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold font-mono">
                  <span className="bg-purple-950 px-1 py-0.5 rounded text-purple-300 text-[10px]">IF</span>
                  <span className="text-purple-100">Sell is available</span>
                  <span className="bg-purple-950 px-1 py-0.5 rounded text-purple-300 text-[10px]">THEN</span>
                </div>
                <div className="p-2 bg-purple-950/40 rounded border border-purple-800/40 text-[11px] text-purple-200">
                  Enable fractional trade resale to arrest heavy drift losses.
                </div>
              </div>
            </div>

            {/* Block #4: Restart Trading block */}
            <div className="bg-[#2563eb] text-white rounded-xl shadow-md border-l-8 border-teal-400 w-full md:max-w-xs overflow-hidden transition-all hover:shadow-lg">
              <div className="p-2.5 bg-blue-800 border-b border-blue-700 flex items-center justify-between text-xs font-mono">
                <span>4. Restart trading conditions</span>
                <Settings className="w-3.5 h-3.5 text-blue-300" />
              </div>
              <div className="p-4 text-xs font-bold flex items-center justify-between bg-blue-900/40">
                <span className="text-blue-100">On trade completion:</span>
                <span className="bg-[#10b981] px-2.5 py-1 text-[10px] text-white uppercase rounded shadow-sm">Trade again</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Canvas Side Panels (Zoom-in, zoom-out & recycle) */}
        <div className="absolute right-5 bottom-5 flex flex-col gap-2 z-20" id="blockly-overlay-tools">
          <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
            <button title="Zoom In" className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all cursor-pointer">
              <Plus className="w-4 h-4" />
            </button>
            <button title="Zoom Out" className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-800 border-t border-gray-100 transition-all cursor-pointer">
              <Minus className="w-4 h-4" />
            </button>
            <button 
              onClick={handleResetWorkspace}
              title="Recycle Canvas Workspace" 
              className="p-2 text-red-500 hover:bg-red-50 border-t border-gray-100 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
