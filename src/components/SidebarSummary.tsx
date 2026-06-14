import { useState, useMemo } from 'react';
import { 
  FileText, 
  Trash2, 
  TrendingUp, 
  CheckCircle, 
  XOctagon, 
  ShieldAlert, 
  Layers, 
  Clock, 
  Clipboard,
  CalendarCheck
} from 'lucide-react';
import { Transaction, JournalLog, TradingStats } from '../types';

interface SidebarSummaryProps {
  transactions: Transaction[];
  journalLogs: JournalLog[];
  onClearTransactions: () => void;
  onClearLogs: () => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
}

export default function SidebarSummary({
  transactions,
  journalLogs,
  onClearTransactions,
  onClearLogs,
  isSidebarOpen,
  setSidebarOpen
}: SidebarSummaryProps) {
  const [activeSubTab, setActiveSubTab] = useState<'SUMMARY' | 'TRANSACTIONS' | 'JOURNAL'>('SUMMARY');

  // Compute live stats in real time
  const stats = useMemo<TradingStats>(() => {
    let totalStake = 0;
    let totalPayout = 0;
    let contractsWon = 0;
    let contractsLost = 0;
    let totalProfit = 0;

    transactions.forEach((tx) => {
      totalStake += tx.stake;
      totalPayout += tx.payout;
      totalProfit += tx.profit;
      if (tx.status === 'won') {
        contractsWon++;
      } else if (tx.status === 'lost') {
        contractsLost++;
      }
    });

    return {
      totalStake,
      totalPayout,
      numberOfRuns: transactions.length,
      contractsLost,
      contractsWon,
      totalProfit
    };
  }, [transactions]);

  const handleCopyLogs = () => {
    const logTexts = journalLogs.map(l => `[${l.time}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(logTexts);
  };

  const isProfitPositive = stats.totalProfit >= 0;

  if (!isSidebarOpen) return null;

  return (
    <div 
      className="w-full md:w-80 bg-white border-l border-gray-200 h-[calc(100vh-120px)] flex flex-col flex-shrink-0 z-40 select-none shadow-lg md:shadow-none"
      id="right-summary-sidebar-drawer"
    >
      {/* Sidebar Tabs Selectors */}
      <div className="flex bg-[#0b1426] p-1 text-xs font-bold text-gray-400 select-none flex-shrink-0">
        <button
          onClick={() => setActiveSubTab('SUMMARY')}
          className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${activeSubTab === 'SUMMARY' ? 'border-blue-500 text-white font-black' : 'border-transparent hover:text-white'}`}
          id="tab-subm-summary"
        >
          Summary
        </button>
        <button
          onClick={() => setActiveSubTab('TRANSACTIONS')}
          className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${activeSubTab === 'TRANSACTIONS' ? 'border-blue-500 text-white font-black' : 'border-transparent hover:text-white'}`}
          id="tab-subm-txs"
        >
          Trades ({transactions.length})
        </button>
        <button
          onClick={() => setActiveSubTab('JOURNAL')}
          className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${activeSubTab === 'JOURNAL' ? 'border-blue-500 text-white font-black' : 'border-transparent hover:text-white'}`}
          id="tab-subm-journal"
        >
          Journal
        </button>
      </div>

      {/* Main Drawer Canvas Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between" id="sidebar-inside-scroller">
        
        {activeSubTab === 'SUMMARY' && (
          <div className="space-y-4">
            {/* Legend title */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Trading Statistics Matrix</span>
              <CalendarCheck className="w-3.5 h-3.5 text-gray-400" />
            </div>

            {/* Numerical indicators grids matching layout of screenshot 3 */}
            <div className="grid grid-cols-2 gap-3" id="stats-board-grid">
              
              <div className="bg-gray-50 border border-gray-150 p-3 rounded-xl">
                <span className="text-[9px] text-gray-400 font-bold block uppercase leading-none">TOTAL STAKE</span>
                <span className="text-sm font-mono font-extrabold text-gray-800 mt-1.5 block">
                  ${stats.totalStake.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="bg-gray-50 border border-gray-150 p-3 rounded-xl">
                <span className="text-[9px] text-gray-400 font-bold block uppercase leading-none">TOTAL PAYOUT</span>
                <span className="text-sm font-mono font-extrabold text-gray-800 mt-1.5 block">
                  ${stats.totalPayout.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="bg-gray-50 border border-gray-150 p-3 rounded-xl col-span-2">
                <span className="text-[9px] text-gray-400 font-bold block uppercase leading-none">NO. OF RUNS</span>
                <span className="text-sm font-mono font-extrabold text-gray-800 mt-1.5 block">
                  {stats.numberOfRuns}
                </span>
              </div>

              <div className="bg-[#f0fdf4] border border-emerald-100 p-2.5 rounded-xl">
                <span className="text-[9px] text-emerald-600 font-bold block uppercase leading-none">WON</span>
                <span className="text-sm font-mono font-extrabold text-emerald-700 mt-1 block">
                  {stats.contractsWon}
                </span>
              </div>

              <div className="bg-[#fef2f2] border border-red-100 p-2.5 rounded-xl">
                <span className="text-[9px] text-red-500 font-bold block uppercase leading-none">LOST</span>
                <span className="text-sm font-mono font-extrabold text-red-650 mt-1 block">
                  {stats.contractsLost}
                </span>
              </div>

              <div className={`col-span-2 p-4 rounded-xl border flex flex-col items-center ${isProfitPositive ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <span className={`text-[10px] uppercase tracking-widest font-bold ${isProfitPositive ? 'text-emerald-700' : 'text-red-750'}`}>NET TOTAL PROFIT</span>
                <span className={`text-xl font-mono font-black mt-1.5 leading-none ${isProfitPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isProfitPositive ? '+' : '-'}${Math.abs(stats.totalProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

            </div>
          </div>
        )}

        {activeSubTab === 'TRANSACTIONS' && (
          <div className="space-y-3.5 flex-1 flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto max-h-[380px] pr-1 space-y-2" id="sidebar-txs-ledger">
              {transactions.length > 0 ? (
                transactions.slice().reverse().map((tx) => (
                  <div 
                    key={tx.id} 
                    className={`border p-2.5 rounded-lg text-[11px] font-medium leading-normal relative ${
                      tx.status === 'won' 
                        ? 'border-emerald-100 bg-emerald-50/20' 
                        : 'border-red-100 bg-red-50/20'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="text-gray-800 font-mono scale-95">{tx.id}</span>
                      <span className={`px-1.5 py-0.5 rounded uppercase text-[8px] font-black font-mono ${
                        tx.status === 'won' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.status}
                      </span>
                    </div>

                    <div className="text-gray-600 text-[10.5px]">
                      <div>Market: <span className="text-gray-900 font-semibold">{tx.market}</span></div>
                      <div className="flex justify-between items-center mt-1">
                        <span>Stake: <strong>${tx.stake}</strong></span>
                        <span>Payout: <strong className={tx.status === 'won' ? 'text-emerald-700' : 'text-gray-500'}>${tx.payout}</strong></span>
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-gray-400 font-mono mt-1 pt-1 border-t border-gray-100">
                        <span>Time: {tx.time}</span>
                        <span>Profit: <strong className={tx.status === 'won' ? 'text-emerald-600' : 'text-red-550'}>${tx.profit >= 0 ? '+' : ''}{tx.profit}</strong></span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400 font-medium text-xs">
                  No active trade contracts found. Launch a bot or trade circles to register statistics.
                </div>
              )}
            </div>

            {transactions.length > 0 && (
              <button
                onClick={onClearTransactions}
                className="w-full py-2 border border-gray-200 hover:bg-gray-50 hover:text-gray-800 rounded-lg text-xs font-bold text-gray-500 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Trade Ledger</span>
              </button>
            )}
          </div>
        )}

        {activeSubTab === 'JOURNAL' && (
          <div className="space-y-3 flex-1 flex flex-col justify-between h-full">
            <div className="flex-1 overflow-y-auto max-h-[350px] font-mono text-[10px] space-y-2 pr-1" id="sidebar-journal-list">
              {journalLogs.length > 0 ? (
                journalLogs.slice().reverse().map((log) => {
                  let logColor = 'text-gray-500';
                  if (log.type === 'success') logColor = 'text-emerald-600 font-bold';
                  else if (log.type === 'error') logColor = 'text-red-600 font-bold';
                  else if (log.type === 'warning') logColor = 'text-amber-650';

                  return (
                    <div key={log.id} className="border-b border-gray-50 pb-1.5 leading-relaxed">
                      <span className="text-gray-450 mr-1.5">[{log.time}]</span>
                      <span className={logColor}>{log.message}</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-gray-400 font-medium">
                  Journal timeline empty. Action logs will stream here.
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleCopyLogs}
                className="py-2 border border-blue-100 text-blue-700 bg-blue-50/50 hover:bg-blue-100 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Copy Logs</span>
              </button>
              <button
                onClick={onClearLogs}
                className="py-2 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Journal</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
