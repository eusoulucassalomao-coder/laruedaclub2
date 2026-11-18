import React, { useState } from 'react';
import { Check, CheckCircle2, Copy, Lock, X } from 'lucide-react';
import {
  formatNumber,
  formatTemplate,
  TranslationDictionary,
} from '../i18n/translations';
import { Language, RewardDefinition } from '../types';
import { SafeImage } from './SafeImage';

interface RewardDetailModalProps {
  reward: RewardDefinition | null;
  currentPoints: number;
  language: Language;
  t: TranslationDictionary;
  onClose: () => void;
  onConfirmRedeem: (rewardId: string) => string | null;
}

export const RewardDetailModal: React.FC<RewardDetailModalProps> = ({
  reward,
  currentPoints,
  language,
  t,
  onClose,
  onConfirmRedeem,
}) => {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!reward) return null;

  const itemCopy = t.rewards.items[reward.id] ?? {
    title: reward.id,
    shortDesc: '',
    fullDesc: '',
  };
  const canRedeem = currentPoints >= reward.pointsRequired;
  const missing = Math.max(0, reward.pointsRequired - currentPoints);
  const remainingAfter = Math.max(0, currentPoints - reward.pointsRequired);

  const handleSimulateRedeem = () => {
    if (!canRedeem || isRedeeming) return;
    setIsRedeeming(true);
    window.setTimeout(() => {
      const code = onConfirmRedeem(reward.id);
      setVoucherCode(code);
      setIsRedeeming(false);
    }, 550);
  };

  const handleCopyVoucher = async () => {
    if (!voucherCode) return;
    try {
      await navigator.clipboard.writeText(voucherCode);
    } catch {
      // Fallback gracefully if clipboard API is unavailable
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseAll = () => {
    setVoucherCode(null);
    setIsRedeeming(false);
    setCopied(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1F281B]/50 backdrop-blur-xs sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={itemCopy.title}
    >
      <div className="absolute inset-0" onClick={handleCloseAll} aria-hidden="true" />

      <div className="relative z-10 w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#FAF7F0] border border-[#E7DFCC] shadow-2xl">
        {/* Mobile bottom-sheet drag indicator */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <span className="w-10 h-1.5 rounded-full bg-[#D8CEB8]" />
        </div>

        {voucherCode ? (
          /* CELEBRATORY DEMO VOUCHER STATE */
          <div className="p-6 sm:p-8">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCloseAll}
                aria-label={t.common.close}
                className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 rounded-xl flex items-center justify-center text-[#5A6353] hover:bg-[#F3EDE0] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EAEFE5] text-[#4A5D3F] flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" strokeWidth={1.8} />
              </div>
              <h2 className="font-display text-2xl font-semibold text-[#293622]">
                {t.rewards.voucherTitle}
              </h2>
              <p className="mt-2 text-sm text-[#5A6353] max-w-sm mx-auto">
                {t.rewards.voucherSubtitle}
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-white border border-[#E7DFCC] p-5 text-center">
              <p className="text-xs font-medium text-[#5A6353]">
                {itemCopy.title} · {formatNumber(reward.pointsRequired, language)}{' '}
                {t.common.pointsShort}
              </p>
              <p className="mt-3 text-xs text-[#6B7365]">
                {t.rewards.voucherCodeLabel}
              </p>
              <div className="mt-1.5 font-mono text-2xl font-semibold tracking-wider text-[#293622] tabular-nums">
                {voucherCode}
              </div>

              <button
                type="button"
                onClick={handleCopyVoucher}
                className="mt-4 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-[#F4F7F0] hover:bg-[#EAEFE5] text-[#293622] text-sm font-semibold transition-colors"
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
            </div>

            <p className="mt-4 text-xs text-center text-[#6B7365] leading-relaxed">
              {t.rewards.voucherDemoDisclaimer}
            </p>

            <button
              type="button"
              onClick={handleCloseAll}
              className="mt-6 w-full min-h-[48px] px-5 py-3 rounded-2xl bg-[#4A5D3F] hover:bg-[#38492F] text-[#FAF7F0] font-semibold text-sm transition-colors"
            >
              {t.rewards.voucherDoneBtn}
            </button>
          </div>
        ) : (
          /* REWARD DETAILS STATE */
          <>
            <div className="relative aspect-[16/10] w-full bg-[#F3EDE0] overflow-hidden sm:rounded-t-3xl">
              <SafeImage
                src={reward.imageUrl}
                alt={itemCopy.title}
                fallbackLabel={itemCopy.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleCloseAll}
                aria-label={t.common.close}
                className="absolute top-3 right-3 min-h-[44px] min-w-[44px] rounded-full bg-[#FAF7F0]/92 text-[#293622] hover:bg-white shadow-sm flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-[#5A6353]">
                <span>{t.rewards.categories[reward.category]}</span>
                <span aria-hidden="true">·</span>
                <span
                  className={
                    canRedeem
                      ? 'font-semibold text-[#4A5D3F]'
                      : 'font-medium text-[#7B6B43]'
                  }
                >
                  {canRedeem
                    ? t.common.available
                    : formatTemplate(t.common.missingPoints, {
                        points: formatNumber(missing, language),
                      })}
                </span>
              </div>

              <h2 className="mt-1.5 font-display text-2xl font-semibold text-[#293622] leading-snug">
                {itemCopy.title}
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-[#4D5647] leading-relaxed">
                {itemCopy.fullDesc}
              </p>

              {/* Balance Comparison Row */}
              <div className="mt-6 grid grid-cols-3 gap-3 py-4 border-y border-[#E7DFCC]">
                <div>
                  <p className="text-xs text-[#5A6353]">{t.rewards.detailCost}</p>
                  <p className="mt-1 font-mono text-base sm:text-lg font-semibold text-[#293622] tabular-nums">
                    {formatNumber(reward.pointsRequired, language)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#5A6353]">
                    {t.rewards.detailYourBalance}
                  </p>
                  <p className="mt-1 font-mono text-base sm:text-lg font-semibold text-[#4A5D3F] tabular-nums">
                    {formatNumber(currentPoints, language)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#5A6353]">
                    {canRedeem
                      ? t.rewards.detailAfterRedeem
                      : t.rewards.detailNeeded}
                  </p>
                  <p className="mt-1 font-mono text-base sm:text-lg font-semibold text-[#293622] tabular-nums">
                    {formatNumber(canRedeem ? remainingAfter : missing, language)}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="font-sans text-xs font-semibold text-[#293622]">
                  {t.rewards.detailTermsTitle}
                </h3>
                <p className="mt-1.5 text-xs text-[#5A6353] leading-relaxed">
                  {t.rewards.detailTermsBody}
                </p>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleSimulateRedeem}
                  disabled={!canRedeem || isRedeeming}
                  className={`flex-1 min-h-[48px] px-5 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    canRedeem
                      ? 'bg-[#4A5D3F] hover:bg-[#38492F] text-[#FAF7F0] active:scale-[0.98]'
                      : 'bg-[#E7DFCC] text-[#6B7365] cursor-not-allowed'
                  }`}
                >
                  {!canRedeem && <Lock className="w-4 h-4" />}
                  <span>
                    {isRedeeming
                      ? t.rewards.simulatingRedeem
                      : canRedeem
                        ? t.rewards.simulateRedeemBtn
                        : t.rewards.insufficientPointsBtn}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleCloseAll}
                  className="min-h-[48px] px-5 py-3 rounded-2xl border border-[#D8CEB8] text-[#293622] hover:bg-[#F3EDE0] font-medium text-sm transition-colors"
                >
                  {t.common.close}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
