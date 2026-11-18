import React, { useState } from 'react';
import { Award, Check, RefreshCw } from 'lucide-react';
import { POINT_MILESTONES } from '../data/demoData';
import {
  formatDate,
  formatNumber,
  formatTemplate,
  TranslationDictionary,
} from '../i18n/translations';
import { HistoryEntry, Language, MemberProfile } from '../types';

interface PointsScreenProps {
  member: MemberProfile;
  history: HistoryEntry[];
  language: Language;
  t: TranslationDictionary;
}

type PointsFilter = 'all' | 'earned' | 'used';

export const PointsScreen: React.FC<PointsScreenProps> = ({
  member,
  history,
  language,
  t,
}) => {
  const [filter, setFilter] = useState<PointsFilter>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const progressPct = Math.min(
    100,
    Math.round((member.points / member.nextRewardTarget) * 100)
  );
  const missing = Math.max(0, member.nextRewardTarget - member.points);

  const filteredMovements = history.filter((entry) => {
    if (filter === 'earned') return entry.pointsDelta > 0;
    if (filter === 'used') return entry.pointsDelta < 0;
    return true;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.setTimeout(() => setIsRefreshing(false), 450);
  };

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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#293622] tracking-tight">
            {t.points.title}
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-[#5A6353]">
            {t.points.subtitle}
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

      {/* 3-Column Balance Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-3xl bg-[#4A5D3F] text-[#FAF7F0] p-6">
          <p className="text-xs font-medium text-[#FAF7F0]/80">
            {t.points.availableBalance}
          </p>
          <p className="mt-2 font-display text-4xl font-semibold tabular-nums">
            {formatNumber(member.points, language)}
            <span className="text-base font-sans font-medium text-[#FAF7F0]/80 ml-1.5">
              {t.common.pointsShort}
            </span>
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-[#E7DFCC] p-6">
          <p className="text-xs font-medium text-[#5A6353]">
            {t.points.accumulatedTotal}
          </p>
          <p className="mt-2 font-display text-4xl font-semibold text-[#293622] tabular-nums">
            {formatNumber(member.lifetimePoints, language)}
            <span className="text-base font-sans font-medium text-[#5A6353] ml-1.5">
              {t.common.pointsShort}
            </span>
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-[#E7DFCC] p-6">
          <p className="text-xs font-medium text-[#5A6353]">
            {t.points.redeemedTotal}
          </p>
          <p className="mt-2 font-display text-4xl font-semibold text-[#293622] tabular-nums">
            {formatNumber(member.redeemedPoints, language)}
            <span className="text-base font-sans font-medium text-[#5A6353] ml-1.5">
              {t.common.pointsShort}
            </span>
          </p>
        </div>
      </section>

      {/* Progress & Milestones Card */}
      <section className="rounded-3xl bg-white border border-[#E7DFCC] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#293622]">
              {formatTemplate(t.points.progressTitle, {
                target: formatNumber(member.nextRewardTarget, language),
              })}
            </h2>
            <p className="mt-1 text-sm text-[#5A6353]">
              {missing > 0
                ? formatTemplate(t.home.pointsToNext, {
                    points: formatNumber(missing, language),
                    target: formatNumber(member.nextRewardTarget, language),
                  })
                : formatTemplate(t.home.rewardGoalReached, {
                    target: formatNumber(member.nextRewardTarget, language),
                  })}
            </p>
          </div>
          <span className="font-mono text-lg font-semibold text-[#4A5D3F] tabular-nums">
            {progressPct}%
          </span>
        </div>

        <div
          className="mt-4 h-3 w-full rounded-full bg-[#F3EDE0] overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-[#4A5D3F] transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Milestones Strip */}
        <div className="mt-7 pt-6 border-t border-[#F0E9D8]">
          <h3 className="font-sans text-xs font-semibold text-[#5A6353] mb-4">
            {t.points.milestonesTitle}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {POINT_MILESTONES.map((milestone) => {
              const reached = member.points >= milestone;
              const isNext = milestone === member.nextRewardTarget && !reached;
              return (
                <div
                  key={milestone}
                  className={`rounded-2xl p-4 border ${
                    reached
                      ? 'bg-[#EAEFE5] border-[#C9D8BC]'
                      : isNext
                        ? 'bg-[#FEF7DC] border-[#EED98B]'
                        : 'bg-[#FAF7F0] border-[#E7DFCC]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-base font-semibold text-[#293622] tabular-nums">
                      {formatNumber(milestone, language)}
                    </span>
                    {reached ? (
                      <Check className="w-4 h-4 text-[#4A5D3F]" strokeWidth={2.5} />
                    ) : (
                      <Award className="w-4 h-4 text-[#7B6B43]" strokeWidth={1.8} />
                    )}
                  </div>
                  <p className="mt-1.5 text-xs font-medium text-[#4D5647]">
                    {reached
                      ? t.points.milestoneReached
                      : isNext
                        ? t.points.milestoneCurrent
                        : t.points.milestoneNext}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filterable Points Movements */}
      <section className="rounded-3xl bg-white border border-[#E7DFCC] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <h2 className="font-display text-2xl font-semibold text-[#293622]">
            {t.points.movementsTitle}
          </h2>

          <div
            className="flex items-center gap-1 p-1 rounded-xl bg-[#F3EDE0]"
            role="tablist"
          >
            {(
              [
                { id: 'all', label: t.points.filterAll },
                { id: 'earned', label: t.points.filterEarned },
                { id: 'used', label: t.points.filterUsed },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={filter === tab.id}
                onClick={() => setFilter(tab.id)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
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

        {isRefreshing ? (
          <div className="space-y-3 py-2" aria-busy="true">
            {[1, 2, 3].map((row) => (
              <div
                key={row}
                className="h-16 rounded-2xl bg-[#F3EDE0]/70 animate-pulse"
              />
            ))}
          </div>
        ) : filteredMovements.length === 0 ? (
          <p className="py-10 text-center text-sm text-[#5A6353]">
            {t.points.emptyMovements}
          </p>
        ) : (
          <ul className="divide-y divide-[#F0E9D8]">
            {filteredMovements.map((entry) => {
              const positive = entry.pointsDelta >= 0;
              return (
                <li
                  key={entry.id}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-[#293622]">
                      {resolveTitle(entry)}
                    </p>
                    <p className="mt-0.5 text-xs sm:text-sm text-[#5A6353]">
                      {resolveDesc(entry)}
                    </p>
                    <p className="mt-1 text-xs text-[#7B8275]">
                      {formatDate(entry.dateIso, language)}
                    </p>
                  </div>
                  <span
                    className={`font-mono text-base font-semibold tabular-nums whitespace-nowrap shrink-0 ${
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

      {/* Simple 3-Step Guide: How Points Work */}
      <section className="rounded-3xl bg-[#F3EDE0]/80 border border-[#E7DFCC] p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-[#293622]">
          {t.points.howItWorksTitle}
        </h2>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { num: '01.', title: t.points.step1Title, desc: t.points.step1Desc },
            { num: '02.', title: t.points.step2Title, desc: t.points.step2Desc },
            { num: '03.', title: t.points.step3Title, desc: t.points.step3Desc },
          ].map((step) => (
            <div key={step.num}>
              <p className="font-mono text-xs font-semibold text-[#4A5D3F]">
                {step.num}
              </p>
              <h3 className="mt-1 font-display text-base font-semibold text-[#293622]">
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-[#5A6353] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
