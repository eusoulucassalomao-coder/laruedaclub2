import React, { useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { getRewardCopy } from '../utils/rewardCopy';
import {
  formatNumber,
  formatTemplate,
  TranslationDictionary,
} from '../i18n/translations';
import { Language, RewardCategory, RewardDefinition } from '../types';
import { SafeImage } from '../components/SafeImage';

interface RewardsScreenProps {
  rewards: RewardDefinition[];
  currentPoints: number;
  language: Language;
  t: TranslationDictionary;
  onSelectReward: (reward: RewardDefinition) => void;
}

type AvailabilityFilter = 'all' | 'available' | 'locked';
type CategoryFilter = 'all' | RewardCategory;

export const RewardsScreen: React.FC<RewardsScreenProps> = ({
  rewards,
  currentPoints,
  language,
  t,
  onSelectReward,
}) => {
  const [availability, setAvailability] = useState<AvailabilityFilter>('all');
  const [category, setCategory] = useState<CategoryFilter>('all');

  // Os prêmios reais não têm categoria (café/padaria...): o filtro por categoria só faz sentido nos exemplos antigos.
  const hasCategories = rewards.some((reward) => !reward.title);

  const filteredRewards = rewards.filter((reward) => {
    const isUnlocked = currentPoints >= reward.pointsRequired;
    if (availability === 'available' && !isUnlocked) return false;
    if (availability === 'locked' && isUnlocked) return false;
    if (category !== 'all' && reward.category !== category) return false;
    return true;
  });

  const resetFilters = () => {
    setAvailability('all');
    setCategory('all');
  };

  return (
    <div className="space-y-7">
      {/* Header with Balance Summary */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#293622] tracking-tight">
            {t.rewards.title}
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-[#5A6353]">
            {t.rewards.subtitle}
          </p>
        </div>

        <div className="rounded-2xl bg-[#4A5D3F] text-[#FAF7F0] px-5 py-3">
          <p className="text-[11px] text-[#FAF7F0]/80">{t.rewards.yourBalance}</p>
          <p className="font-mono text-xl font-semibold tabular-nums">
            {formatNumber(currentPoints, language)} {t.common.pointsShort}
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Availability Segmented Control */}
        <div
          className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#F3EDE0] w-fit"
          role="tablist"
        >
          {(
            [
              { id: 'all', label: t.rewards.filterAll },
              { id: 'available', label: t.rewards.filterAvailable },
              { id: 'locked', label: t.rewards.filterLocked },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={availability === tab.id}
              onClick={() => setAvailability(tab.id)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                availability === tab.id
                  ? 'bg-white text-[#293622] shadow-xs'
                  : 'text-[#5A6353] hover:text-[#293622]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Filter Buttons */}
        <div
          className={`flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 ${
            hasCategories ? '' : 'hidden'
          }`}
        >
          {(
            ['all', 'cafe', 'bakery', 'experiences', 'boutique'] as const
          ).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors ${
                category === cat
                  ? 'bg-[#4A5D3F] text-[#FAF7F0] border-[#4A5D3F]'
                  : 'bg-white text-[#5A6353] border-[#E7DFCC] hover:border-[#4A5D3F] hover:text-[#293622]'
              }`}
            >
              {t.rewards.categories[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Rewards Grid or Empty State */}
      {filteredRewards.length === 0 ? (
        <div className="rounded-3xl bg-white border border-[#E7DFCC] p-10 text-center">
          <h2 className="font-display text-xl font-semibold text-[#293622]">
            {t.rewards.emptyStateTitle}
          </h2>
          <p className="mt-2 text-sm text-[#5A6353] max-w-md mx-auto">
            {t.rewards.emptyStateDesc}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 min-h-[44px] px-5 py-2.5 rounded-2xl bg-[#4A5D3F] hover:bg-[#38492F] text-[#FAF7F0] text-sm font-semibold transition-colors"
          >
            {t.rewards.clearFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map((reward) => {
            const copy = getRewardCopy(reward, t);
            const unlocked = currentPoints >= reward.pointsRequired;
            const missing = Math.max(0, reward.pointsRequired - currentPoints);

            return (
              <button
                key={reward.id}
                type="button"
                onClick={() => onSelectReward(reward)}
                className="group text-left rounded-3xl bg-white border border-[#E7DFCC] overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all flex flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A5D3F]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3EDE0]">
                  <SafeImage
                    src={reward.imageUrl}
                    alt={copy.title}
                    fallbackLabel={copy.title}
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02] ${
                      unlocked ? '' : 'saturate-[0.75] opacity-90'
                    }`}
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    {/* Clean unboxed metadata row */}
                    <div className="flex items-center gap-2 text-xs text-[#5A6353]">
                      {!reward.title && (
                        <>
                          <span>{t.rewards.categories[reward.category]}</span>
                          <span aria-hidden="true">·</span>
                        </>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 ${
                          unlocked
                            ? 'font-semibold text-[#4A5D3F]'
                            : 'font-medium text-[#7B6B43]'
                        }`}
                      >
                        {!unlocked && <Lock className="w-3 h-3" />}
                        {unlocked
                          ? t.common.available
                          : formatTemplate(t.common.missingPoints, {
                              points: formatNumber(missing, language),
                            })}
                      </span>
                    </div>

                    <h2 className="mt-1.5 font-display text-lg font-semibold text-[#293622] leading-snug">
                      {copy.title}
                    </h2>
                    <p className="mt-1 text-sm text-[#5A6353] leading-relaxed line-clamp-2">
                      {copy.shortDesc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F0E9D8] flex items-center justify-between gap-2">
                    <span className="font-mono text-base font-semibold text-[#293622] tabular-nums">
                      {formatNumber(reward.pointsRequired, language)}{' '}
                      {t.common.pointsShort}
                    </span>

                    <span
                      className={`text-xs font-semibold inline-flex items-center gap-1 ${
                        unlocked ? 'text-[#4A5D3F]' : 'text-[#6B7365]'
                      }`}
                    >
                      {unlocked ? t.rewards.simulateRedeemBtn : t.common.locked}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
