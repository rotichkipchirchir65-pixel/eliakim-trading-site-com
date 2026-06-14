import { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  HelpCircle, 
  FileCode, 
  Download, 
  FileText, 
  Check, 
  Globe2, 
  ExternalLink,
  ChevronRight,
  Flame,
  UserCheck
} from 'lucide-react';
import { TabType, FreeBot } from '../types';

interface FreeBotsProps {
  addLog: (msg: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  setActiveTab: (tab: TabType) => void;
  loadPresetConfig: (preset: any) => void;
}

export default function FreeBotsTab({ addLog, setActiveTab, loadPresetConfig }: FreeBotsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'FREE' | 'STORE'>('FREE');
  const [loadedBotId, setLoadedBotId] = useState<string | null>(null);
  const [guideModalBot, setGuideModalBot] = useState<FreeBot | null>(null);

  // List of bots representing the screenshot exactly
  const botsList: FreeBot[] = [
    {
      id: 'apex',
      name: 'Apex Switcher 🔥',
      description: 'Automatically alternates between Even/Odd, Over/Under 5, and Rise/Fall contracts after a user-defined number of trades. Designed for traders who need high strategy diversity to buffer synthetic drift.',
      tag: 'PREMIUM',
      isPremium: true,
      accuracy: '89.4%'
    },
    {
      id: 'digitprov1',
      name: 'Digit Pro V1 ⚡',
      description: 'Trade Over 2 / Under 7 with a smart recovery system. Executes Even/Odd purchases based on statistical percentages and last 3 matching digit patterns.',
      tag: 'PREMIUM',
      isPremium: true,
      accuracy: '87.2%'
    },
    {
      id: 'evenoddpercent',
      name: 'Even Odd Percentage Based',
      description: 'If Even% is Greater than 65% Then Trade Even and If Odd% is Greater than 65% Then Trade Odd. Extremely solid for index markets that sustain temporary digit parity saturation.',
      tag: 'SMART',
      isPremium: false,
      accuracy: '82.5%'
    },
    {
      id: 'evenoddstreak',
      name: 'Even Odd Streak Switcher Pro',
      description: 'Auto-switching Even/Odd bot. Switches direction after 3-5 consecutive same-parity runs. Optional 60% percentage filter for smarter entries. Includes compound recovery.',
      tag: 'SMART',
      isPremium: false,
      accuracy: '84.8%'
    },
    {
      id: 'evenoddpattern',
      name: 'Even odd Pattern Same Direction',
      description: 'If the last 5 digits are Even Then Trade Even and If the last 5 digits are Odd Then Trade Odd. Classic follow-the-trend algorithm matching standard synthetic market ticks.',
      tag: 'SMART',
      isPremium: false,
      accuracy: '80.1%'
    },
    {
      id: 'over4under5reversal',
      name: 'Over4 Under5 Reversal {Pattern Strategies}',
      description: 'Digit scalping bot with multiple options (3-8 ticks). Trade Over 4 when tick is <= 4, and trade Under 5 when tick is >= 5. Leverages immediate regression variables.',
      tag: 'SMART',
      isPremium: false,
      accuracy: '83.3%'
    }
  ];

  const handleLoadBot = (bot: FreeBot) => {
    setLoadedBotId(bot.id);
    addLog(`Downloading binary instructions for: ${bot.name}...`, 'info');
    
    // Inject preset details into the general trading configs
    const mockPreset: any = {
      isLoaded: true,
      botName: bot.name,
      stake: bot.isPremium ? 2.0 : 0.5,
      tp: bot.isPremium ? 10.0 : 5.0,
      sl: bot.isPremium ? 50.0 : 30.0,
      enableMartingale: true,
      martingaleMultiplier: bot.isPremium ? 2.1 : 2.0,
      lastNTicks: bot.id === 'evenoddpattern' ? 5 : 3
    };

    setTimeout(() => {
      loadPresetConfig(mockPreset);
      setLoadedBotId(null);
      addLog(`Preset configuration loaded successfully. strategy: ${bot.name} is active.`, 'success');
      setActiveTab('Ultimate Bot');
    }, 1100);
  };

  const filteredBots = botsList.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          bot.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeSubTab === 'FREE') {
      return matchesSearch && !bot.isPremium;
    } else {
      return matchesSearch && bot.isPremium;
    }
  });

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-120px)] text-gray-800 p-6 font-sans select-none" id="free-bots-tab-panel">
      {/* Search Header and filters */}
      <div className="max-w-6xl mx-auto mb-6">
        
        {/* Toggle between Free Bots and Bots Store */}
        <div className="flex bg-gray-200 border border-gray-300 rounded-lg p-1 max-w-sm mb-6 text-xs font-bold shadow-inner">
          <button 
            onClick={() => setActiveSubTab('FREE')}
            className={`flex-1 py-2 rounded transition-all cursor-pointer text-center ${activeSubTab === 'FREE' ? 'bg-blue-900 text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Free Bots
          </button>
          <button 
            onClick={() => setActiveSubTab('STORE')}
            className={`flex-1 py-2 rounded transition-all cursor-pointer text-center ${activeSubTab === 'STORE' ? 'bg-blue-900 text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Bots Store (Premium)
          </button>
        </div>

        {/* Search Input aligned with screenshot 5 */}
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">SEARCH BOTS</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search bots by name or description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 font-medium shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Bots list grid matching screenshot */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="bots-shop-grid">
        {filteredBots.length > 0 ? (
          filteredBots.map((bot) => (
            <div 
              key={bot.id} 
              className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden ${
                bot.isPremium 
                  ? 'border-amber-200 bg-gradient-to-b from-amber-50/20 to-white' 
                  : 'border-slate-200'
              }`}
            >
              <div>
                {/* Is premium decoration bar */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[9px] font-black uppercase tracking-widest font-mono border px-2 py-0.5 rounded-full ${
                    bot.isPremium 
                      ? 'bg-amber-100 text-amber-800 border-amber-200' 
                      : 'bg-blue-100 text-blue-800 border-blue-200'
                  }`}>
                    {bot.tag} BOT
                  </span>
                  
                  {bot.isPremium && (
                    <span className="flex items-center gap-1.5 text-[9px] font-bold text-amber-600 uppercase font-mono">
                      <Sparkles className="w-3 h-3 text-amber-400" /> Premium
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className="font-bold text-base text-gray-800 flex items-center gap-1.5">
                  {bot.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 leading-relaxed mt-2 pb-4">
                  {bot.description}
                </p>
              </div>

              {/* Action buttons matching screenshot */}
              <div className="border-t border-gray-100 pt-4 flex gap-2 w-full mt-2">
                <button
                  type="button"
                  onClick={() => setGuideModalBot(bot)}
                  className="px-4 py-2 border border-red-200 hover:border-red-400 text-red-500 hover:bg-red-50 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer flex-1 justify-center"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Guide</span>
                </button>

                <button
                  type="button"
                  disabled={loadedBotId === bot.id}
                  onClick={() => handleLoadBot(bot)}
                  className={`px-4 py-2 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-2 ${
                    bot.isPremium 
                      ? 'bg-amber-500 hover:bg-amber-600 hover:shadow-md' 
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{loadedBotId === bot.id ? 'Loading...' : 'LOAD BOT'}</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-2xl font-semibold">
            No bots match "{searchTerm}" under {activeSubTab === 'FREE' ? 'Free Bots' : 'Premium Store'}.
          </div>
        )}
      </div>

      {/* Guide details Popup Modal */}
      {guideModalBot && (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto flex items-center justify-center z-[100] p-4 select-text">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-lg w-full p-6 relative">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
              <FileCode className="w-5 h-5 text-red-500" />
              Strategy Blueprint: {guideModalBot.name}
            </h3>
            
            <div className="space-y-3.5 text-xs text-gray-600 leading-relaxed mt-2.5">
              <p className="font-semibold text-gray-800 mt-1">
                How does this automation logic execute?
              </p>
              <p>
                {guideModalBot.description} This bot targets precise tick fluctuations on Volatility Indices. Inside, it calculates standard deviation runs of digits to determine if the pattern matches.
              </p>
              
              <div className="bg-gray-50 p-3 rounded-lg font-mono text-[11px] text-gray-700 border border-gray-150 space-y-1">
                <div>// Strategy parameters loaded:</div>
                <div>const recoveryEnabled = true;</div>
                <div>const stakeAmount = {guideModalBot.isPremium ? '2.00 USD' : '0.50 USD'};</div>
                <div>const martingaleMultiplier = {guideModalBot.isPremium ? '2.1' : '2.0'};</div>
                <div>const estimatedAccuracy = "{guideModalBot.accuracy}";</div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-blue-900 font-medium">
                🔒 Always practice with your Demo virtual account to configure specific martingale caps before switching inputs live!
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setGuideModalBot(null)}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
              >
                Got it, close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
