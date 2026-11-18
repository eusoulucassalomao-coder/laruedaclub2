import React, { useState } from 'react';
import { Check, Copy, X } from 'lucide-react';
import { formatNumber, TranslationDictionary } from '../i18n/translations';
import { Language, MemberProfile } from '../types';
import { BrandLogo } from './BrandLogo';

interface MemberCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: MemberProfile;
  language: Language;
  t: TranslationDictionary;
}

export const MemberCardModal: React.FC<MemberCardModalProps> = ({
  isOpen,
  onClose,
  member,
  language,
  t,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(member.customerCode);
    } catch {
      // ignore
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  // Deterministic decorative barcode bars derived from customerCode characters
  const bars = Array.from({ length: 34 }, (_, idx) => {
    const ch = member.customerCode.charCodeAt(idx % member.customerCode.length);
    const width = ((ch + idx * 7) % 3) + 1.5;
    return { idx, width, dark: (ch + idx) % 2 === 0 || idx < 3 || idx > 30 };
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F281B]/55 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.memberCard.title}
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#FAF7F0] border border-[#E7DFCC] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#293622]">
              {t.memberCard.title}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#5A6353]">
              {t.memberCard.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 rounded-xl flex items-center justify-center text-[#5A6353] hover:bg-[#F3EDE0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Olive Digital Pass */}
        <div className="mt-5 rounded-3xl bg-[#4A5D3F] text-[#FAF7F0] p-6 shadow-md">
          <div className="flex items-center justify-between gap-3">
            <BrandLogo variant="inverted" size="sm" />
            <span className="text-xs text-[#FAF7F0]/80">
              {t.memberCard.presentAtCounter}
            </span>
          </div>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-[#FAF7F0]/75">{member.fullName}</p>
              <p className="mt-0.5 font-mono text-2xl font-semibold tracking-wider tabular-nums">
                {member.customerCode}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#FAF7F0]/75">
                {t.memberCard.balanceLabel}
              </p>
              <p className="mt-0.5 font-mono text-xl font-semibold text-[#FACC15] tabular-nums">
                {formatNumber(member.points, language)} {t.common.pointsShort}
              </p>
            </div>
          </div>

          {/* Crisp scannable barcode surface */}
          <div className="mt-6 rounded-2xl bg-[#FAF7F0] px-5 py-4 text-center">
            <svg
              viewBox="0 0 240 52"
              className="w-full h-12 mx-auto"
              role="img"
              aria-label={member.customerCode}
            >
              {(() => {
                let x = 8;
                return bars.map((bar) => {
                  const rect = (
                    <rect
                      key={bar.idx}
                      x={x}
                      y={2}
                      width={bar.width * 2}
                      height={48}
                      rx={1}
                      fill={bar.dark ? '#1F281B' : 'transparent'}
                    />
                  );
                  x += bar.width * 2 + 2.4;
                  return rect;
                });
              })()}
            </svg>
            <p className="mt-2 font-mono text-xs tracking-[0.24em] text-[#293622] font-semibold">
              {member.customerCode}
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 min-h-[48px] px-4 py-3 rounded-2xl bg-white border border-[#D8CEB8] hover:bg-[#F3EDE0] text-[#293622] text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#4A5D3F]" />
                <span>{t.common.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#4A5D3F]" />
                <span>{t.common.copyCode}</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] px-5 py-3 rounded-2xl bg-[#4A5D3F] hover:bg-[#38492F] text-[#FAF7F0] text-sm font-semibold transition-colors"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
