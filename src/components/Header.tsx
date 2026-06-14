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
import { parseReferralLink, ReferralInfo } from '../utils/referral';

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
  const [isLoggedOutSetupOpen, setIsLoggedOutSetupOpen] = useState(false);
  const [inputValue, setInputValue] = useState(derivAppId);
  const [manualAccount, setManualAccount] = useState('');
  const [manualToken, setManualToken] = useState('');
  const [manualCurrency, setManualCurrency] = useState('USD');
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(() => {
    const cached = localStorage.getItem('deriv_referral_info');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Sync input value with parent state
  useEffect(() => {
    setInputValue(derivAppId);
  }, [derivAppId]);

  useEffect(() => {
    const info = parseReferralLink(window.location.href);
    if (info) {
      localStorage.setItem('deriv_referral_info', JSON.stringify(info));
      setReferralInfo(info);
      addLog(`Partner tracking detected: active token ${info.affiliateToken} (${info.affiliateTokenParam})`, "success");
    }
  }, []);

  const getSignUpUrl = () => {
    const baseUrl = "https://track.deriv.com/link.fcg?op=register";
    if (!referralInfo) return baseUrl;

    try {
      const url = new URL(baseUrl);
      url.searchParams.set(referralInfo.affiliateTokenParam, referralInfo.affiliateToken);
      if (referralInfo.utmCampaign) {
        url.searchParams.set('utm_campaign', referralInfo.utmCampaign);
      }
      if (referralInfo.utmSource) {
        url.searchParams.set('utm_source', referralInfo.utmSource);
      }
      if (referralInfo.utmMedium) {
        url.searchParams.set('utm_medium', referralInfo.utmMedium);
      }
      return url.toString();
    } catch {
      return baseUrl;
    }
  };
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
                const oauthUrl = `https://oauth.deriv.com/oauth2/authorize?app_id=${derivAppId}&l=en&redirect_uri=${redirectUrl}`;
                addLog(`Redirecting to secure Deriv OAuth portal with App ID: ${derivAppId}...`, "info");
                window.location.href = oauthUrl;
              }}
              className="bg-[#152238] hover:bg-[#1f304f] active:bg-[#0c1524] text-white text-xs font-semibold px-4 py-1.5 rounded transition-all cursor-pointer shadow-sm uppercase font-mono tracking-wider text-center"
              title="Click to authenticate directly with Deriv"
            >
              Log in
            </button>

            {/* 2. API Settings / Token configuration popover */}
            <div className="relative">
              <button
                onClick={() => setIsLoggedOutSetupOpen(!isLoggedOutSetupOpen)}
                className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded cursor-pointer transition-all border border-gray-300 flex items-center gap-1"
                title="Configure custom App ID, redirect routes, or manual developer tokens"
              >
                <Settings className="w-3.5 h-3.5 text-gray-500" />
                <span>API Settings</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>

              {isLoggedOutSetupOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-50 text-xs text-gray-750" id="deriv-logged-out-popover">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                    <span className="font-bold text-gray-800 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-red-500" />
                      Deriv Integration Hub
                    </span>
                    <button 
                      onClick={() => setIsLoggedOutSetupOpen(false)}
                      className="p-1 hover:bg-gray-150 rounded text-gray-400 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* HELP SECTION */}
                    <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-blue-900 space-y-1.5 bg-clip-padding text-[11px] leading-normal font-sans">
                      <span className="block font-bold">A. Whitelist OAuth Redirect Domain:</span>
                      <p className="text-[10px] text-blue-800 font-medium">
                        Deriv OAuth requires whitelisting your active domain name inside your application's profile on the Deriv developer portal:
                      </p>
                      
                      <div className="flex flex-col gap-1 mt-1">
                        <span className="text-[10.5px]">
                          1. Visit <a href="https://api.deriv.com/" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-blue-950">api.deriv.com</a> & log in.
                        </span>
                        <span className="text-[10.5px]">
                          2. Register/update your App ID and add this active environment redirect URL:
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 mt-1.5 font-mono">
                        <div className="flex items-center bg-white border border-blue-100 rounded p-1.5 justify-between gap-1 text-[9px] text-gray-700 select-all">
                          <span className="break-all whitespace-pre-wrap">{window.location.origin}/</span>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.origin + "/");
                              addLog("Active Preview URL copied to clipboard!", "success");
                            }}
                            className="p-1 hover:bg-gray-100 rounded text-blue-600 flex-shrink-0 cursor-pointer"
                            title="Copy Active URL"
                          >
                            <Clipboard className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <div className="flex items-center bg-white border border-blue-100 rounded p-1.5 justify-between gap-1 text-[9px] text-gray-700 select-all">
                          <span className="break-all whitespace-pre-wrap text-emerald-705">https://eliakim-trading-site-com-4y76.vercel.app/</span>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText("https://eliakim-trading-site-com-4y76.vercel.app/");
                              addLog("Production Vercel URL copied to clipboard!", "success");
                            }}
                            className="p-1 hover:bg-gray-100 rounded text-emerald-650 flex-shrink-0 cursor-pointer"
                            title="Copy Production URL"
                          >
                            <Clipboard className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* APP ID CONFIG */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block font-mono">My Custom App ID:</label>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value);
                          setDerivAppId(e.target.value);
                        }}
                        placeholder="e.g. 33yjzVFBvxegoDiBsKb9K"
                        className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-red-500 font-mono text-xs text-gray-800"
                      />
                    </div>

                    {/* MANUAL CONNECTION OPTION */}
                    <div className="border-t border-gray-150 pt-3.5 space-y-2">
                      <div className="flex flex-col font-sans">
                        <span className="font-bold text-gray-800 text-[11px] block">B. Instant Developer Token</span>
                        <span className="text-[10px] text-gray-450 leading-relaxed">
                          Bypass OAuth redirects! Generate an API token on Deriv (Settings → API Token with 'Read' and 'Trade' scopes) and insert below:
                        </span>
                      </div>

                      <div className="space-y-1.5 mt-1.5 text-left">
                        <div className="flex gap-1.5">
                          <div className="flex-1">
                            <label className="text-[9px] text-gray-400 font-mono uppercase">CR Account ID:</label>
                            <input
                              type="text"
                              value={manualAccount}
                              onChange={(e) => setManualAccount(e.target.value)}
                              placeholder="CR123456"
                              className="w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1 focus:outline-none text-xs font-mono text-gray-800 placeholder:text-gray-300"
                            />
                          </div>
                          <div className="w-20 font-sans">
                            <label className="text-[9px] text-gray-440 font-mono uppercase">Currency:</label>
                            <select
                              value={manualCurrency}
                              onChange={(e) => setManualCurrency(e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 rounded px-1.5 py-1 focus:outline-none text-xs font-mono text-gray-800"
                            >
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
                              <option value="GBP">GBP</option>
                              <option value="AUD">AUD</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] text-gray-400 font-mono uppercase block">API Token (Trade scope):</label>
                          <input
                            type="password"
                            value={manualToken}
                            onChange={(e) => setManualToken(e.target.value)}
                            placeholder="Paste 15-char API Token"
                            className="w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none text-xs font-mono text-gray-800 tracking-wider placeholder:tracking-normal placeholder:text-gray-300"
                          />
                        </div>

                        <button
                          onClick={() => {
                            if (!manualAccount.trim()) {
                              addLog("Please enter a valid Account ID (e.g. CR123456 or VRTC123456)", "error");
                              return;
                            }
                            if (!manualToken.trim()) {
                              addLog("Please paste your Deriv API token generated with 'Read' and 'Trade' scopes.", "error");
                              return;
                            }
                            const accountIdFormated = manualAccount.trim().toUpperCase();
                            const manualObj = [{
                              account: accountIdFormated,
                              token: manualToken.trim(),
                              cur: manualCurrency
                            }];
                            localStorage.setItem('deriv_accounts', JSON.stringify(manualObj));
                            localStorage.setItem('deriv_active_acct', accountIdFormated);
                            addLog(`Setting manual developer token. Activating secure context for account: ${accountIdFormated}...`, "success");
                            setIsLoggedOutSetupOpen(false);
                            setTimeout(() => {
                              window.location.reload();
                            }, 450);
                          }}
                          className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-[10px] tracking-wider rounded transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer mt-1"
                        >
                          <Key className="w-3 h-3 text-white" />
                          Inject Token & Connect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Sign up button */}
            <a
              href={getSignUpUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#152238] hover:bg-[#1f304f] active:bg-[#0c1524] text-white text-xs font-semibold px-4 py-1.5 rounded transition-all shadow-sm uppercase font-mono tracking-wider text-center cursor-pointer"
              title={referralInfo ? `Sign up using active affiliate partner: ${referralInfo.affiliateToken}` : undefined}
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
