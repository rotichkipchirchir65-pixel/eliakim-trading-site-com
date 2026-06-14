export interface Transaction {
  id: string;
  time: string;
  type: string;
  market: string;
  stake: number;
  payout: number;
  profit: number;
  status: 'won' | 'lost' | 'pending';
  contractType: string;
  purchaseTick?: number;
  exitTick?: number;
}

export interface JournalLog {
  id: string;
  time: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export interface TradingStats {
  totalStake: number;
  totalPayout: number;
  numberOfRuns: number;
  contractsLost: number;
  contractsWon: number;
  totalProfit: number;
}

export interface MarketSignal {
  id: number;
  market: string;
  condition: string;
  description: string;
  values: {
    key: string;
    value: string;
  }[];
  confidence: number;
  type: 'OVER' | 'UNDER' | 'ODD' | 'EVEN';
  target: number;
  actionLabel: string;
}

export interface BotConfig {
  initialTradeType: string;
  recoveryType: string;
  lastNTicks: number;
  stake: number;
  tp: number;
  sl: number;
  enableMartingale: boolean;
  martingaleMultiplier: number;
}

export interface FreeBot {
  id: string;
  name: string;
  description: string;
  tag: 'PREMIUM' | 'SMART' | 'FREE';
  isPremium: boolean;
  accuracy: string;
}

export interface ProAIStrategy {
  id: string;
  name: string;
  condition: string;
  description: string;
  isOpen: boolean;
}

export type TabType =
  | 'Dashboard'
  | 'Bot Builder'
  | 'Analysistools'
  | 'Free Bots'
  | 'Pro AI'
  | 'Auto Trader'
  | 'Ultimate Bot'
  | 'DTrader'
  | 'Manual Trading'
  | 'Speedbot'
  | 'Chart'
  | 'Copy Trading'
  | 'Deriv Course';
