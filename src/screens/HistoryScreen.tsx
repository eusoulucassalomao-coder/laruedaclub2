import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  RefreshCw,
  Search,
  Ticket,
  X,
} from 'lucide-react';
import {
  formatDate,
  formatNumber,
  TranslationDictionary,
} from '../i18n/translations';
import { HistoryEntry, HistoryEntryType, Language } from '../types';

interface HistoryScreenProps {
  history: HistoryEntry[];
  language: Language;
  t: TranslationDictionary;
}

type HistoryFilter = 'all' | HistoryEntryType;

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  language,
  t,
}) => {
  const [filter, setFilter] = useState<HistoryFilter>('all');
  const [query, setQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedVoucherEntry, setSelectedVoucherEntry] =
    useState<HistoryEntry | null>(null);

  const resolveTitle = (entry: HistoryEntry) => {
    if (entry.customTitle) return entry.customTitle;
    if (entry.titleKey && t.history.entries[entry.titleKey]) {
      return t.history.entries[entry.titleKey];
    }
    if (entry.rewardId && t.rewards.items[entry.rewardId]) {
      return `${t.history.typeLabels.redeemed}: ${t.rewards.items[entry.rewardId].title}`;
    }
    return t.history.typeLabels[entry.type];
  };

  const resolveDesc = (entry: HistoryEntry) => {
    if (entry.customDescription) return entry.customDescription;
    if (entry.descriptionKey && t.history.entries[entry.descriptionKey]) {
      return t.history.entries[entry.descriptionKey];
    }
    return entry.branchName ?? '';
  };

  const filteredHistory = history.filter((entry) => {
    if (filter !== 'all' && entry.type !== filter) return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    const haystack = [
      resolveTitle(entry),
      resolveDesc(entry),
      entry.branchName ?? '',
      entry.voucherCode ?? '',
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.setTimeout(() => setIsRefreshing(false), 450);
  };

  const clearFilters = () => {
    setFilter('all');
    setQuery('');
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#293622] tracking-tight">
            {t.history.title}
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-[#5A6353]">
            {t.history.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="min-h-[44px] px-4 py-2 rounded-2xl bg-white border border-[#D8CEB8] hover:bg-[#F3EDE0] text-[#293622] text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
        >
          <RefreshCw
            className={`w-4 h-4 text-[#4A5D3F] ${isRefreshing ? 'animate-spin' : ''}`}
          />
          <span>{isRefreshing ? t.common.loading : t.common.refresh}</span>
        </button>
      </div>

      {/* Search + Segmented Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#6B7365] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.history.searchPlaceholder}
            className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-2xl bg-white border border-[#D8CEB8] text-sm text-[#1F281B] placeholder:text-[#7B8275] focus:outline-none focus:border-[#4A5D3F]"
          />
        </div>

        <div
          className="flex items-center gap-1 p-1 rounded-xl bg-[#F3EDE0] overflow-x-auto"
          role="tablist"
        >
          {(
            [
              { id: 'all', label: t.history.filterAll },
              { id: 'earned', label: t.history.filterEarned },
              { id: 'used', label: t.history.filterUsed },
              { id: 'redeemed', label: t.history.filterRedeemed },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => setFilter(tab.id)}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                filter === tab.id
                  ? 'bg-white text-[#293622] shadow-xs'
                  : 'text-[#5A6353] hover:text-[#293622]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* History List Container */}
      <section className="rounded-3xl bg-white border border-[#E7DFCC] p-5 sm:p-7">
        {isRefreshing ? (
          <div className="space-y-3 py-2" aria-busy="true">
            {[1, 2, 3, 4].map((row) => (
              <div
                key={row}
                className="h-20 rounded-2xl bg-[#F3EDE0]/70 animate-pulse"
              />
            ))}
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-12 text-center">
            <h2 className="font-display text-xl font-semibold text-[#293622]">
              {t.history.emptyTitle}
            </h2>
            <p className="mt-2 text-sm text-[#5A6353] max-w-sm mx-auto">
              {t.history.emptyDesc}
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 min-h-[44px] px-5 py-2.5 rounded-2xl bg-[#4A5D3F] hover:bg-[#38492F] text-[#FAF7F0] text-sm font-semibold transition-colors"
            >
              {t.history.clearSearch}
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-[#F0E9D8]">
            {filteredHistory.map((entry) => {
              const positive = entry.pointsDelta >= 0;
              return (
                <li
                  key={entry.id}
                  className="py-4 first:pt-1 last:pb-1 flex items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        entry.type === 'earned'
                          ? 'bg-[#EAEFE5] text-[#4A5D3F]'
                          : entry.type === 'redeemed'
                            ? 'bg-[#FEF7DC] text-[#8C6413]'
                            : 'bg-[#F3EDE0] text-[#7A5432]'
                      }`}
                    >
                      {entry.type === 'earned' && (
                        <ArrowDownLeft className="w-5 h-5" />
                      )}
                      {entry.type === 'redeemed' && <Gift className="w-5 h-5" />}
                      {entry.type === 'used' && (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-semibold text-[#293622]">
                        {resolveTitle(entry)}
                      </p>
                      <p className="mt-0.5 text-xs sm:text-sm text-[#5A6353]">
                        {resolveDesc(entry)}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-[#6B7365]">
                        <span>{formatDate(entry.dateIso, language)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{t.history.typeLabels[entry.type]}</span>
                        {entry.voucherCode && (
                          <>
                            <span aria-hidden="true">·</span>
                            <button
                              type="button"
                              onClick={() => setSelectedVoucherEntry(entry)}
                              className="inline-flex items-center gap-1 font-semibold text-[#4A5D3F] hover:underline"
                            >
                              <Ticket className="w-3.5 h-3.5" />
                              <span>{t.history.viewVoucher}</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`font-mono text-sm sm:text-base font-semibold tabular-nums whitespace-nowrap shrink-0 ${
                      positive ? 'text-[#4A5D3F]' : 'text-[#8C5B32]'
                    }`}
                  >
                    {positive ? '+' : ''}
                    {formatNumber(entry.pointsDelta, language)}{' '}
                    {t.common.pointsShort}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Demo Voucher Inspection Modal */}
      {selectedVoucherEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F281B]/50 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0"
            onClick={() => setSelectedVoucherEntry(null)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-sm rounded-3xl bg-[#FAF7F0] border border-[#E7DFCC] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display text-xl font-semibold text-[#293622]">
                {t.history.voucherModalTitle}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedVoucherEntry(null)}
                aria-label={t.common.close}
                className="min-h-[40px] min-w-[40px] -mr-2 -mt-2 rounded-xl flex items-center justify-center text-[#5A6353] hover:bg-[#F3EDE0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 rounded-2xl bg-white border border-[#E7DFCC] p-5 text-center">
              <p className="text-sm font-semibold text-[#293622]">
                {resolveTitle(selectedVoucherEntry)}
              </p>
              <p className="mt-1 text-xs text-[#5A6353]">
                {formatDate(selectedVoucherEntry.dateIso, language)}
              </p>
              <p className="mt-4 text-xs text-[#6B7365]">
                {t.rewards.voucherCodeLabel}
              </p>
              <p className="mt-1 font-mono text-2xl font-semibold text-[#4A5D3F] tracking-wider">
                {selectedVoucherEntry.voucherCode}
              </p>
            </div>

            <p className="mt-4 text-xs text-center text-[#6B7365]">
              {t.rewards.voucherDemoDisclaimer}
            </p>

            <button
              type="button"
              onClick={() => setSelectedVoucherEntry(null)}
              className="mt-5 w-full min-h-[46px] rounded-2xl bg-[#4A5D3F] hover:bg-[#38492F] text-[#FAF7F0] text-sm font-semibold transition-colors"
            >
              {t.common.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
