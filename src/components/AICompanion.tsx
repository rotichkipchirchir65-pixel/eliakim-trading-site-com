import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  RotateCcw, 
  Bot, 
  ShieldAlert, 
  HelpCircle,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface AICompanionProps {
  isAiOpen: boolean;
  setAiOpen: (val: boolean) => void;
  addLog: (msg: string, type: 'info' | 'success' | 'error' | 'warning') => void;
}

export default function AICompanion({ isAiOpen, setAiOpen, addLog }: AICompanionProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      parts: [{ text: "Hello! I am your AI Automations Advisor. Ask me anything about creating blocks in Bot Builder, setting up Martingales safely in Auto Trader, or the structural probabilities of digit circles in DCIRCLE!" }]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isAiOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMsg = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    const newMessages = [
      ...messages,
      { role: 'user' as const, parts: [{ text: userMsg }] }
    ];
    setMessages(newMessages);

    addLog(`Operator querying AI Companion: "${userMsg.slice(0, 30)}..."`, 'info');

    try {
      // Map message history mapping exactly to Gemini chats structure
      const historyPayload = messages.map(m => ({
        role: m.role,
        parts: m.parts
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMsg,
          history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error("Server responded with an error");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'model', parts: [{ text: data.text || "I was unable to synthesize a response. Check API logs." }] }
      ]);
    } catch (err: any) {
      console.error("AI Assistant connection error:", err);
      setMessages((prev) => [
        ...prev,
        { role: 'model', parts: [{ text: "⚠️ Hello! I encountered a connection issue fetching the latest insights. Please verify your GEMINI_API_KEY environment configuration." }] }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'model',
        parts: [{ text: "Let's reset! Ask me anything regarding risk boundaries, digital scans, or creating binary bots." }]
      }
    ]);
    addLog("AI strategy coach conversation logs cleared.", "info");
  };

  // Local helper to format basic bold strings and partitions inside bubble dialogue
  const renderMessageContent = (text: string) => {
    return text.split('\n').map((line, lIdx) => {
      // Basic translation format
      let parsed = line;
      
      // Handle simple bold tokens: **my text** -> <strong>my text</strong>
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIdx = 0;
      let match;
      
      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIdx) {
          parts.push(line.substring(lastIdx, match.index));
        }
        parts.push(<strong key={match.index} className="text-gray-900 font-extrabold">{match[1]}</strong>);
        lastIdx = boldRegex.lastIndex;
      }
      
      if (lastIdx < line.length) {
        parts.push(line.substring(lastIdx));
      }

      return (
        <div key={lIdx} className="mb-1 leading-relaxed">
          {parts.length > 0 ? parts : parsed}
        </div>
      );
    });
  };

  return (
    <>
      {/* 1. Floating Sparkles trigger bubble */}
      <button
        onClick={() => setAiOpen(!isAiOpen)}
        className="fixed bottom-16 right-5 p-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-full shadow-lg hover:shadow-indigo-500/30 hover:scale-110 active:scale-95 transition-all z-40 flex items-center justify-center cursor-pointer border border-indigo-900/40"
        title="Open strategy coach"
        id="btn-ai-bubble-floating"
      >
        <Sparkles className="w-5.5 h-5.5 animate-pulse" />
      </button>

      {/* 2. Slide-up chat panel dialog */}
      {isAiOpen && (
        <div 
          className="fixed bottom-14 right-5 w-[380px] h-[500px] bg-white border border-gray-200 rounded-2xl shadow-2xl z-[98] flex flex-col overflow-hidden transition-all duration-300"
          id="ai-coach-overlay-card"
        >
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2 select-none">
              <Bot className="w-5 h-5 text-indigo-300 animate-bounce" />
              <div>
                <h4 className="font-bold text-xs font-display">Algorithmic Advisor</h4>
                <p className="text-[9px] text-indigo-200 leading-none">Gemini 3.5 Assistant Core</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={handleResetChat}
                title="Clear logs" 
                className="p-1 hover:bg-white/10 rounded transition-all cursor-pointer text-indigo-300 hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setAiOpen(false)}
                className="p-1 hover:bg-white/10 rounded transition-all cursor-pointer text-indigo-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick recommendations chips */}
          <div className="p-2 bg-gray-50 border-b border-gray-100 flex gap-1 overflow-x-auto scrollbar-none select-none">
            <button 
              onClick={() => setInputMessage("Explain Martingale risk calculation")}
              className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-md text-[10px] font-semibold text-gray-600 whitespace-nowrap cursor-pointer"
            >
              📊 Martingale Risk
            </button>
            <button 
              onClick={() => setInputMessage("Explain Over/Under strategies")}
              className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-md text-[10px] font-semibold text-gray-600 whitespace-nowrap cursor-pointer"
            >
              ⚡ Over/Under Strategy
            </button>
            <button 
              onClick={() => setInputMessage("What is Volatility Index digit scanning?")}
              className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-md text-[10px] font-semibold text-gray-600 whitespace-nowrap cursor-pointer"
            >
              🎯 Digit Scan FAQ
            </button>
          </div>

          {/* Messaging stream */}
          <div 
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50 text-[11.5px]"
            id="chat-messages-scroll-area"
          >
            {messages.map((m, idx) => {
              const isAi = m.role === 'model';
              return (
                <div 
                  key={idx} 
                  className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`p-3 rounded-2xl max-w-[85%] shadow-sm ${
                    isAi 
                      ? 'bg-white border border-gray-150 text-gray-700 rounded-bl-sm' 
                      : 'bg-indigo-600 text-white rounded-br-sm'
                  }`}>
                    {renderMessageContent(m.parts[0].text)}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-2xl bg-white border border-gray-150 text-gray-400 font-medium rounded-bl-sm flex items-center gap-1.5 shadow-sm">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-900" />
                  <span>AI Coach is compiling strategy formulas...</span>
                </div>
              </div>
            )}
          </div>

          {/* Form message input */}
          <form 
            onSubmit={handleSendMessage}
            className="p-2 border-t border-gray-100 bg-white flex gap-1.5 items-center"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me option strategy parameters..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-medium"
            />
            <button 
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:hover:bg-indigo-600 h-full flex items-center justify-center shadow"
            >
              <Send className="w-3.5 h-3.5 fill-current" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
