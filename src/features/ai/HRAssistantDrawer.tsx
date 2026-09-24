import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Sparkles, ExternalLink, BookOpen } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { askHRAssistant, type AIResponse } from "../../lib/api/ai";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  citations?: string[];
  actionLink?: {
    label: string;
    url: string;
  };
  timestamp: string;
}

interface HRAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HRAssistantDrawer({ isOpen, onClose }: HRAssistantDrawerProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m0",
      sender: "ai",
      content: `Hello ${user?.name || "there"}! I am your **AI HR Assistant**. You can ask me about your leave balances, shift schedules, company holidays, attendance policies, or latest payslip details.`,
      citations: ["EMS Knowledge Base 2026"],
      timestamp: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "How many leaves do I have left?",
    "What is the policy on half days and late arrival?",
    "When is the next company holiday?",
    "Explain my latest payslip.",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || !user) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: "Just now",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const res: AIResponse = await askHRAssistant(text, user);
      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        sender: "ai",
        content: res.answer,
        citations: res.sourceCitations,
        actionLink: res.actionLink,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "ai",
          content:
            "Sorry, I encountered an issue retrieving policy context. Please try again.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-blue-500 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-text-main">
                  EMS AI Assistant
                </h3>
                <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-1.5 py-0.2 rounded-full">
                  Policy v2.6
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Permission-aware policy & self-service
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-none">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] whitespace-nowrap bg-white text-slate-700 border border-slate-200/80 px-2.5 py-1 rounded-full hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-primary text-white rounded-tr-xs"
                    : "bg-slate-100 text-text-main rounded-tl-xs border border-slate-200/50"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {m.actionLink && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                    <button
                      onClick={() => {
                        navigate(m.actionLink!.url);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      {m.actionLink.label}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {m.citations && m.citations.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex flex-wrap items-center gap-1.5 text-[10px] text-text-muted">
                    <BookOpen className="w-3 h-3 text-slate-400" />
                    <span className="font-medium">Sources:</span>
                    {m.citations.map((c, idx) => (
                      <span
                        key={idx}
                        className="bg-white/80 px-1.5 py-0.5 rounded border border-slate-200"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {m.timestamp}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-text-muted bg-slate-100 px-3.5 py-2.5 rounded-2xl w-fit">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" />
              <span>Analyzing organization policies...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask HR policy, leave balance, payslip..."
              className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-center text-text-muted mt-2">
            AI responses cite official 2026 company policies and live employee
            records.
          </p>
        </div>
      </div>
    </div>
  );
}
