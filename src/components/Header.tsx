import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  FileText, 
  ChevronDown, 
  RefreshCw, 
  Wallet, 
  Radio, 
  Menu, 
  X,
  Clipboard,
  Globe,
  LogOut,
  Settings,
  Shield,
  Key
} from 'lucide-react';

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
  derivAccounts: { account: string; token: string; cur: string }[];
  activeDerivAcct: string | null;
  setActiveDerivAcct: (acct: string) => void;
  derivAppId: string;
  setDerivAppId: (appId: string) => void;
  onClearDerivAccounts: () => void;
  addLog: (msg: string, type: 'info' | 'success' | 'error' | 'warning') => void;
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
  setUsername,
  derivAccounts,
  activeDerivAcct,
  setActiveDerivAcct,
  derivAppId,
  setDerivAppId,
  onClearDerivAccounts,
  addLog
}: HeaderProps) {
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [inputValue, setInputValue] = useState(derivAppId);

  // Sync input value with parent state
  useEffect(() => {
    setInputValue(derivAppId);
  }, [derivAppId]);
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
        
        {derivAccounts.length === 0 ? (
          <div className="flex items-center gap-2">
            {/* 1. Log in button - immediate OAuth redirect */}
            <button
              onClick={() => {
                const redirectUrl = encodeURIComponent(window.location.origin + "/");
                const oauthUrl = `https://oauth.deriv.app/oauth?app_id=${derivAppId}&l=en&redirect_uri=${redirectUrl}`;
                addLog(`Redirecting to secure Deriv OAuth portal with App ID: ${derivAppId}...`, "info");
                window.location.href = oauthUrl;
              }}
              className="bg-[#152238] hover:bg-[#1f304f] active:bg-[#0c1524] text-white text-xs font-semibold px-4 py-1.5 rounded transition-all cursor-pointer shadow-sm uppercase font-mono tracking-wider"
              title="Click to authenticate directly with Deriv"
            >
              Log in
            </button>



            {/* 3. Sign up button */}
            <a
              href="https://track.deriv.com/link.fcg?op=register"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#152238] hover:bg-[#1f304f] active:bg-[#0c1524] text-white text-xs font-semibold px-4 py-1.5 rounded transition-all shadow-sm uppercase font-mono tracking-wider text-center cursor-pointer"
            >
              Sign up
            </a>
          </div>
        ) : (
          <>
            {/* Case: Already Authorized with real/demo Deriv accounts */}
            <div className="relative">
              <button
                onClick={() => setIsSetupOpen(!isSetupOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shadow-sm cursor-pointer transition-all"
              >
                <Key className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span>{activeDerivAcct}</span>
                <ChevronDown className="w-3 h-3 text-emerald-500" />
              </button>

              {isSetupOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white border border-gray-250 rounded-2xl shadow-xl p-4 z-50 text-xs text-gray-700" id="deriv-popover">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                    <span className="font-bold text-gray-800 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-500" />
                      Deriv Integration Hub
                    </span>
                    <button 
                      onClick={() => setIsSetupOpen(false)}
                      className="p-1 hover:bg-gray-100 rounded text-gray-400 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="font-semibold text-[11px]">Real accounts successfully synchronized!</span>
                    </div>

                    <div>
                      <span className="block font-bold text-gray-450 uppercase tracking-wider text-[9px] mb-1.5">Select Active Wallet:</span>
                      <div className="space-y-1.5">
                        {derivAccounts.map((acct) => {
                          const isActive = acct.account === activeDerivAcct;
                          return (
                            <button
                              key={acct.account}
                              onClick={() => {
                                setActiveDerivAcct(acct.account);
                                setIsSetupOpen(false);
                              }}
                              className={`w-full text-left p-2 rounded-lg border flex items-center justify-between transition-all cursor-[pointer] ${
                                isActive 
                                  ? 'bg-emerald-50/55 border-emerald-300 font-bold text-emerald-950' 
                                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                              }`}
                            >
                              <div>
                                <span className="block font-semibold">{acct.account}</span>
                                <span className="text-[10px] text-gray-400 font-medium font-mono leading-none">Currency: {acct.cur || 'USD'}</span>
                              </div>
                              {isActive ? (
                                <span className="text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-800 uppercase font-bold font-mono">Active</span>
                              ) : (
                                <span className="text-[9px] text-gray-400 font-mono">Select</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex gap-2">
                      <button
                        onClick={() => {
                          onClearDerivAccounts();
                          setIsSetupOpen(false);
                        }}
                        className="flex-1 py-1.5 border border-red-200 text-red-650 bg-red-50/50 hover:bg-red-100 hover:text-red-700 rounded-lg text-center font-bold font-mono text-[10px] uppercase cursor-pointer transition-all flex items-center justify-center gap-1"
                      >
                        <LogOut className="w-3 h-3" />
                        Disconnect
                      </button>
                      <button
                        onClick={() => {
                          addLog("Requesting immediate re-authorization sweep...", "info");
                          setIsSetupOpen(false);
                          window.location.reload();
                        }}
                        className="flex-1 py-1.5 border border-gray-250 bg-gray-50 rounded-lg text-center font-bold text-gray-600 hover:bg-gray-100 text-[10px] uppercase cursor-pointer transition-all"
                      >
                        Re-authorize
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

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
                title={isDemo ? "Replenish Demo Balance" : "Account Status Synced"}
                className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded text-gray-500 transition-all cursor-pointer"
                id="btn-replenish-wallet"
              >
                <RefreshCw className="w-3 h-3 hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>

            {/* Deposit shortcut */}
            <div className="hidden sm:flex items-center gap-1 border-l border-gray-200 pl-3">
              <button className="flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 px-2.5 py-1.5 rounded-lg border border-gray-200 cursor-pointer">
                <Wallet className="w-3.5 h-3.5 text-gray-500" />
                <span>Deposit</span>
              </button>
            </div>
          </>
        )}

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
