import { MessageSquare, FileText, ChevronDown, RefreshCw, Wallet, Radio, Menu, X } from 'lucide-react';

interface HeaderProps {
  balance: number;
  isDemo: boolean;
  setIsDemo: (val: boolean) => void;
  onResetBalance: () => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
  setAiOpen: (val: boolean) => void;
  username: string;
  setUsername: (name: string) => void;
}

export default function Header({
  balance,
  isDemo,
  setIsDemo,
  onResetBalance,
  isSidebarOpen,
  setSidebarOpen,
  setAiOpen,
  username,
  setUsername
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 px-4 py-2.5 flex items-center justify-between" id="app-header">
      {/* Left side: Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-display text-xl font-bold tracking-tight text-gray-900">
          <span className="text-gray-900 flex items-center gap-1">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            Binarytool
          </span>
          <span className="text-xs font-normal text-gray-400 self-end pb-0.5 leading-none">
            powered by <span className="text-red-500 font-semibold">deriv</span>
          </span>
        </div>

        {/* Vertical divider */}
        <div className="hidden md:block h-6 w-px bg-gray-200 mx-2"></div>

        {/* AI chat shortcut */}
        <button
          onClick={() => setAiOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-all cursor-pointer"
          id="btn-ai-chat-hdr"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Interactive Strategy Coach</span>
        </button>

        {/* Reports indicator */}
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
            isSidebarOpen 
              ? 'text-white bg-gray-900' 
              : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
          id="btn-reports-hdr"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Reports & Logs</span>
        </button>
      </div>

      {/* Customizable username overlay */}
      <div className="hidden lg:flex items-center gap-2">
        <label className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">Operator:</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Set Name"
          className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-gray-800 w-32 tracking-wider"
          id="username-input"
        />
      </div>

      {/* Right side: Wallet, Account Swapper & Demo Settings */}
      <div className="flex items-center gap-3">
        {/* Account selection: USD / DEMO dropdown */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1 text-xs font-semibold" id="account-type-swapper">
          <button 
            type="button"
            onClick={() => setIsDemo(false)}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${!isDemo ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Real
          </button>
          <button 
            type="button"
            onClick={() => setIsDemo(true)}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${isDemo ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-600 hover:text-amber-800'}`}
          >
            Demo
          </button>
        </div>

        {/* USD Balance Card */}
        <div className="flex items-center border border-gray-200 shadow-sm rounded-lg pl-2.5 pr-1.5 py-1 bg-white select-none gap-2">
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold leading-none">
              {isDemo ? 'Virtual Balance' : 'Real Wallet'}
            </span>
            <span className={`font-mono text-xs font-bold ${isDemo ? 'text-amber-600' : 'text-emerald-600'}`}>
              {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>
          </div>
          
          <button 
            onClick={onResetBalance}
            title={isDemo ? "Replenish Balance" : "Reset simulated funds"}
            className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded text-gray-500 transition-all cursor-pointer"
            id="btn-replenish-wallet"
          >
            <RefreshCw className="w-3 h-3 hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* Main dropdown menu indicators */}
        <div className="hidden sm:flex items-center gap-1 border-l border-gray-200 pl-3">
          <button className="flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 px-2.5 py-1.5 rounded-lg border border-gray-200 cursor-pointer">
            <Wallet className="w-3.5 h-3.5 text-gray-500" />
            <span>Deposit</span>
          </button>
        </div>

        {/* Mobile menu triggers */}
        <div className="flex md:hidden gap-1">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
            id="mobile-sidemenu-trigger"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
