import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Send, X } from 'lucide-react';
import { REWARDS_CATALOG, SECONDARY_LOOKUP_MEMBER } from '../data/demoData';
import {
  formatNumber,
  formatTemplate,
  TranslationDictionary,
} from '../i18n/translations';
import { AssistantMessage, Language, MemberProfile, TabId } from '../types';

interface VirtualAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  member: MemberProfile;
  language: Language;
  t: TranslationDictionary;
  onNavigate: (tab: TabId) => void;
  onOpenRegister: () => void;
}

function getTimeLabel(locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

export const VirtualAssistantDrawer: React.FC<VirtualAssistantDrawerProps> = ({
  isOpen,
  onClose,
  member,
  language,
  t,
  onNavigate,
  onOpenRegister,
}) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Initialize or update greeting when language changes
  useEffect(() => {
    setMessages([
      {
        id: `welcome-${language}`,
        sender: 'assistant',
        text: t.assistant.welcomeMessage,
        timestamp: getTimeLabel(t.locale),
      },
    ]);
  }, [language, t.assistant.welcomeMessage, t.locale]);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      const timer = window.setTimeout(() => inputRef.current?.focus(), 200);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, messages.length, isTyping]);

  if (!isOpen) return null;

  const generateReply = (rawInput: string): Omit<AssistantMessage, 'id' | 'sender' | 'timestamp'> => {
    const clean = rawInput.trim();
    const upper = clean.toUpperCase();
    const lower = clean.toLowerCase();

    // Check explicit codes: SOF4821, MAR4821, or active custom demo code
    if (upper.includes('SOF4821') || lower.includes('sofia') || lower.includes('sofía')) {
      return {
        text: formatTemplate(t.assistant.replyPointsUnlocked, {
          name: SECONDARY_LOOKUP_MEMBER.fullName,
          code: SECONDARY_LOOKUP_MEMBER.customerCode,
          points: formatNumber(SECONDARY_LOOKUP_MEMBER.points, language),
          branch: SECONDARY_LOOKUP_MEMBER.favoriteBranch,
        }),
        action: {
          type: 'navigate-rewards',
          label: t.assistant.actionViewRewards,
        },
      };
    }

    if (
      upper.includes('MAR4821') ||
      upper.includes(member.customerCode.toUpperCase()) ||
      lower.includes('maría') ||
      lower.includes('maria') ||
      lower.includes('mis puntos') ||
      lower.includes('my points') ||
      lower.includes('meus pontos') ||
      lower.includes('saldo')
    ) {
      const remaining = Math.max(0, member.nextRewardTarget - member.points);
      const replyTemplate =
        member.points >= 1200
          ? t.assistant.replyPointsUnlocked
          : t.assistant.replyPointsFound;
      return {
        text: formatTemplate(replyTemplate, {
          name: member.fullName,
          code: member.customerCode,
          points: formatNumber(member.points, language),
          target: formatNumber(member.nextRewardTarget, language),
          remaining: formatNumber(remaining, language),
          branch: member.favoriteBranch,
        }),
        action: {
          type: 'lookup-sof',
          label: t.assistant.actionTrySof,
        },
      };
    }

    // Check if user typed an unknown customer-code-like token (e.g., ABC1234)
    const unknownCodeMatch = upper.match(/\b[A-Z]{2,4}\d{3,5}\b/);
    if (unknownCodeMatch) {
      return {
        text: formatTemplate(t.assistant.replyCodeNotFound, {
          code: unknownCodeMatch[0],
        }),
        action: {
          type: 'lookup-mar',
          label: t.assistant.quickCheckMar,
        },
      };
    }

    // Benefits / rewards questions
    if (
      lower.includes('benefic') ||
      lower.includes('recompen') ||
      lower.includes('reward') ||
      lower.includes('canje') ||
      lower.includes('resgat') ||
      lower.includes('café') ||
      lower.includes('coffee') ||
      lower.includes('premio')
    ) {
      const unlockedCount = REWARDS_CATALOG.filter(
        (r) => member.points >= r.pointsRequired
      ).length;
      return {
        text: formatTemplate(t.assistant.replyBenefitsSummary, {
          points: formatNumber(member.points, language),
          count: unlockedCount,
        }),
        action: {
          type: 'navigate-rewards',
          label: t.assistant.actionViewRewards,
        },
      };
    }

    // Registration questions
    if (
      lower.includes('registr') ||
      lower.includes('cadastr') ||
      lower.includes('cuenta') ||
      lower.includes('conta') ||
      lower.includes('sign up') ||
      lower.includes('account') ||
      lower.includes('alta')
    ) {
      return {
        text: t.assistant.replyRegisterGuide,
        action: {
          type: 'open-register',
          label: t.assistant.actionOpenRegister,
        },
      };
    }

    // Install PWA questions
    if (
      lower.includes('instal') ||
      lower.includes('app') ||
      lower.includes('iphone') ||
      lower.includes('safari') ||
      lower.includes('android') ||
      lower.includes('pwa')
    ) {
      return {
        text: t.assistant.replyInstallGuide,
        action: {
          type: 'navigate-profile-previews',
          label: t.assistant.actionOpenPreviews,
        },
      };
    }

    return {
      text: t.assistant.replyFallback,
      action: {
        type: 'navigate-rewards',
        label: t.assistant.actionViewRewards,
      },
    };
  };

  const handleSend = (textToSend?: string) => {
    const content = (textToSend ?? inputValue).trim();
    if (!content || isTyping) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: content,
      timestamp: getTimeLabel(t.locale),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    window.setTimeout(() => {
      const reply = generateReply(content);
      const assistantMsg: AssistantMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: reply.text,
        action: reply.action,
        timestamp: getTimeLabel(t.locale),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 420);
  };

  const handleMessageAction = (type: NonNullable<AssistantMessage['action']>['type']) => {
    if (type === 'navigate-rewards') {
      onClose();
      onNavigate('rewards');
    } else if (type === 'open-register') {
      onClose();
      onOpenRegister();
    } else if (type === 'lookup-sof') {
      handleSend('SOF4821');
    } else if (type === 'lookup-mar') {
      handleSend('MAR4821');
    } else if (type === 'navigate-profile-previews') {
      onClose();
      onNavigate('profile');
      window.setTimeout(() => {
        document
          .getElementById('screen-previews-section')
          ?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  const quickPrompts = [
    { label: t.assistant.quickCheckMar, value: 'MAR4821' },
    { label: t.assistant.quickCheckSof, value: 'SOF4821' },
    { label: t.assistant.quickBenefits, value: t.assistant.quickBenefits },
    { label: t.assistant.quickRegister, value: t.assistant.quickRegister },
    { label: t.assistant.quickInstall, value: t.assistant.quickInstall },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1F281B]/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={t.assistant.title}
    >
      {/* Backdrop click to dismiss */}
      <div className="flex-1" onClick={onClose} aria-hidden="true" />

      {/* Conversation Drawer */}
      <div className="w-full max-w-md h-full bg-[#FAF7F0] shadow-2xl border-l border-[#E7DFCC] flex flex-col">
        {/* Header with Waving Hand (NO robot icon) */}
        <div className="px-5 py-4 bg-[#4A5D3F] text-[#FAF7F0] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-[#FAF7F0]/15 flex items-center justify-center shrink-0">
              <span className="wave-hand-once text-2xl leading-none" role="img" aria-hidden="true">
                👋
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-lg font-semibold leading-tight truncate">
                {t.assistant.title}
              </h2>
              <p className="text-xs text-[#FAF7F0]/80 truncate mt-0.5">
                {t.assistant.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-[#FAF7F0]/85 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    isUser
                      ? 'bg-[#4A5D3F] text-[#FAF7F0] rounded-br-md'
                      : 'bg-white text-[#1F281B] border border-[#E7DFCC] rounded-bl-md'
                  }`}
                >
                  {msg.text}

                  {msg.action && (
                    <button
                      type="button"
                      onClick={() => handleMessageAction(msg.action!.type)}
                      className="mt-3 w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-[#EAEFE5] hover:bg-[#dce5d4] text-[#293622] text-xs font-semibold flex items-center justify-between gap-2 transition-colors"
                    >
                      <span>{msg.action.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  )}
                </div>
                <span className="text-[11px] text-[#6B7365] mt-1 px-1 tabular-nums">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-start">
              <div className="rounded-2xl rounded-bl-md bg-white border border-[#E7DFCC] px-4 py-3 text-sm text-[#5A6353]">
                {t.common.loading}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Interactive Suggestion Buttons */}
        <div className="px-4 pt-3 pb-2 border-t border-[#E7DFCC] bg-[#FAF7F0]">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt.label}
                type="button"
                onClick={() => handleSend(prompt.value)}
                disabled={isTyping}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#D8CEB8] hover:border-[#4A5D3F] hover:bg-[#F4F7F0] text-xs font-medium text-[#293622] transition-colors whitespace-nowrap"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Input Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t.assistant.placeholder}
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-2xl bg-white border border-[#D8CEB8] text-sm text-[#1F281B] placeholder:text-[#7B8275] focus:outline-none focus:border-[#4A5D3F]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              aria-label={t.assistant.sendAria}
              className="min-h-[44px] min-w-[44px] rounded-2xl bg-[#4A5D3F] hover:bg-[#38492F] disabled:opacity-45 text-[#FAF7F0] flex items-center justify-center transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-[#6B7365] text-center mt-2.5">
            {t.assistant.demoFooterNote}
          </p>
        </div>
      </div>
    </div>
  );
};
