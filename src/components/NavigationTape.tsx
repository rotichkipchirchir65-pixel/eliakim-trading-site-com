import { 
  LayoutDashboard, 
  Cpu, 
  AreaChart, 
  Gift, 
  Sparkles, 
  Play, 
  Flame, 
  Tv, 
  Hand, 
  Zap, 
  LineChart, 
  Users, 
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useRef } from 'react';
import { TabType } from '../types';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function NavigationTape({ activeTab, setActiveTab }: NavigationProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const tabs: { name: TabType; icon: any }[] = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Bot Builder', icon: Cpu },
    { name: 'Analysistools', icon: AreaChart },
    { name: 'Free Bots', icon: Gift },
    { name: 'Pro AI', icon: Sparkles },
    { name: 'Auto Trader', icon: Play },
    { name: 'Ultimate Bot', icon: Flame },
    { name: 'DTrader', icon: Tv },
    { name: 'Manual Trading', icon: Hand },
    { name: 'Speedbot', icon: Zap },
    { name: 'Chart', icon: LineChart },
    { name: 'Copy Trading', icon: Users },
    { name: 'Deriv Course', icon: GraduationCap },
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-[#0b1426] text-gray-300 relative select-none border-b border-gray-900" id="nav-tape-container">
      {/* Scroll assistance left button */}
      <button 
        type="button"
        onClick={() => handleScroll('left')}
        className="absolute left-0 top-0 bottom-0 px-2 bg-gradient-to-r from-[#0b1426] via-[#0b1426]/90 to-transparent z-10 text-gray-400 hover:text-white transition-all cursor-pointer"
        aria-label="Scroll Left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Main horizontally scrollable area */}
      <div 
        ref={scrollRef}
        className="flex items-center gap-1 overflow-x-auto scrollbar-none px-7 py-1.5 whitespace-nowrap scroll-smooth"
        id="tab-choices-box"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              id={`tab-${tab.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 font-bold scale-[1.02]' 
                  : 'hover:bg-gray-800 hover:text-gray-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Scroll assistance right button */}
      <button 
        type="button"
        onClick={() => handleScroll('right')}
        className="absolute right-0 top-0 bottom-0 px-2 bg-gradient-to-l from-[#0b1426] via-[#0b1426]/90 to-transparent z-10 text-gray-400 hover:text-white transition-all cursor-pointer"
        aria-label="Scroll Right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
