import { useState, useEffect } from 'react';
import { 
  Globe, 
  Clock, 
  HelpCircle, 
  Cpu, 
  TrendingUp, 
  Signal
} from 'lucide-react';

interface FooterStatusProps {
  isAnyBotRunning: boolean;
  botSpeedSetting: 'slow' | 'fast';
  setBotSpeedSetting: (speed: 'slow' | 'fast') => void;
  transactionsCount: number;
}

export default function FooterStatus({
  isAnyBotRunning,
  botSpeedSetting,
  setBotSpeedSetting,
  transactionsCount
}: FooterStatusProps) {
  const [currentTime, setCurrentTime] = useState('');

  // Live ticking UTC/GMT clock
  useEffect(() => {
    const clockTimer = setInterval(() => {
      const now = new Date();
      const utcStr = now.toUTCString().replace('GMT', 'UTC');
      setCurrentTime(utcStr);
    }, 1000);

    return () => clearInterval(clockTimer);
  }, []);

  return (
    <footer 
      className="bg-[#0b1426] border-t border-gray-900 px-4 py-2 text-gray-400 text-xs font-semibold flex flex-col md:flex-row items-center justify-between gap-3 select-none flex-shrink-0"
      id="app-footer-indicator"
    >
      {/* Left side: language swapper and general diagnostic */}
      <div className="flex items-center gap-4">
        {/* Language selector */}
        <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-all">
          <Globe className="w-3.5 h-3.5 text-gray-500" />
          <span className="font-bold">EN</span>
        </div>

        {/* Vertical divider */}
        <div className="h-4 w-px bg-gray-800"></div>

        {/* Micro-Speed dial */}
        <div className="flex items-center gap-1.5" id="bot-speed-swaps">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Sim Speed:</span>
          <button
            onClick={() => setBotSpeedSetting('slow')}
            className={`px-1.5 py-0.5 rounded text-[10px] transition-all cursor-pointer ${botSpeedSetting === 'slow' ? 'bg-[#1e293b] text-blue-400 font-bold border border-blue-900/40' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Slow
          </button>
          <button
            onClick={() => setBotSpeedSetting('fast')}
            className={`px-1.5 py-0.5 rounded text-[10px] transition-all cursor-pointer ${botSpeedSetting === 'fast' ? 'bg-[#1e293b] text-amber-500 font-bold border border-amber-900/40' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Fast (Ticks Boosted)
          </button>
        </div>
      </div>

      {/* Center: System heartbeat */}
      <div className="flex items-center gap-2 font-mono text-[11px]" id="engine-heartbeat">
        {isAnyBotRunning ? (
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold animate-pulse">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>BOT COMPILED & EXECUTING STRATEGIES</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-gray-500 transition-all font-bold">
            <Signal className="w-3.5 h-3.5 text-gray-700 animate-pulse" />
            <span>Bot is not running</span>
          </span>
        )}
      </div>

      {/* Right side: UTC clock */}
      <div className="flex items-center gap-3">
        {/* Total runs metric */}
        <span className="text-[10px] text-gray-500 uppercase font-mono font-bold">
          TOTAL CONTRACTS CAPTURED: {transactionsCount}
        </span>

        {/* Dynamic UTC date string */}
        <div className="flex items-center gap-1 text-gray-400 font-mono text-[10.5px]">
          <Clock className="w-3.5 h-3.5 text-gray-500 self-center" />
          <span>{currentTime || 'GMT Clock Fetching...'}</span>
        </div>
      </div>
    </footer>
  );
}
