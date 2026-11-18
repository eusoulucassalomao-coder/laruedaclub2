import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  CreditCard,
  Download,
  Gift,
  UserPlus,
  X,
} from 'lucide-react';
import { getRewardCopy } from '../utils/rewardCopy';
import {
  formatDate,
  formatNumber,
  formatTemplate,
  TranslationDictionary,
} from '../i18n/translations';
import {
  HistoryEntry,
  Language,
  MemberProfile,
  RewardDefinition,
  TabId,
} from '../types';
import { BrandLogo } from '../components/BrandLogo';
import { SafeImage } from '../components/SafeImage';

interface HomeScreenProps {
  member: MemberProfile;
  history: HistoryEntry[];
  rewards: RewardDefinition[];
  language: Language;
  t: TranslationDictionary;
  isInstalled: boolean;
  isInstallable: boolean;
  onInstallPwa: () => void;
  onNavigate: (tab: TabId) => void;
  onSelectReward: (reward: RewardDefinition) => void;
  onOpenMemberCard: () => void;
  onOpenRegister: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  member,
  history,
  rewards,
  language,
  t,
  isInstalled,
  isInstallable,
  onInstallPwa,
  onNavigate,
  onSelectReward,
  onOpenMemberCard,
  onOpenRegister,
}) => {
  const [desktopBannerHidden, setDesktopBannerHidden] = useState(false);

  const featuredRewards = rewards.filter((r) => r.featured).slice(0, 3);
  const recentHistory = history.slice(0, 3);

  const progressPct = Math.min(
    100,
    Math.round((member.points / member.nextRewardTarget) * 100)
  );
  const missingToNext = Math.max(0, member.nextRewardTarget - member.points);

  const resolveHistoryTitle = (entry: HistoryEntry) => {
    if (entry.customTitle) return entry.customTitle;
    if (entry.titleKey && t.history.entries[entry.titleKey]) {
      return t.history.entries[entry.titleKey];
    }
    if (entry.rewardId && t.rewards.items[entry.rewardId]) {
      return `${t.history.typeLabels.redeemed}: ${t.rewards.items[entry.rewardId].title}`;
    }
    return t.history.typeLabels[entry.type];
  };

  return (
    <div className="space-y-8">
      {/* Greeting & Focal Olive Membership Pass */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Dominant Focal Anchor — Olive Loyalty Card */}
        <div className="lg:col-span-7 rounded-3xl bg-[#4A5D3F] text-[#FAF7F0] p-6 sm:p-8 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[#FAF7F0]/80">{t.home.subtitle}</p>
                <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
                  {formatTemplate(t.home.greeting, { name: member.firstName })}
                </h1>
              </div>
              <BrandLogo variant="icon-only" size="md" />
            </div>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#FAF7F0]/75">
                  {t.home.currentBalance}
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-5xl sm:text-6xl font-semibold tracking-tight tabular-nums">
                    {formatNumber(member.points, language)}
                  </span>
                  <span className="text-base sm:text-lg font-medium text-[#FAF7F0]/85">
                    {t.common.pointsFull}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs text-[#FAF7F0]/75">
                  {t.home.memberCodeLabel}
                </p>
                <p className="mt-1 font-mono text-lg font-semibold tracking-wider text-[#FACC15] tabular-nums">
                  {member.customerCode}
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar toward next reward */}
          <div className="mt-7 pt-6 border-t border-[#FAF7F0]/15">
            <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
              <span className="text-[#FAF7F0]/85 font-medium">
                {t.home.nextRewardProgress}
              </span>
              <span className="font-mono font-semibold tabular-nums text-[#FACC15]">
                {formatNumber(member.points, language)} /{' '}
                {formatNumber(member.nextRewardTarget, language)}{' '}
                {t.common.pointsShort}
              </span>
            </div>

            <div
              className="mt-2.5 h-2.5 w-full rounded-full bg-[#293622]/60 overflow-hidden"
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-[#FACC15] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-[#FAF7F0]/85">
                {missingToNext > 0
                  ? formatTemplate(t.home.pointsToNext, {
                      points: formatNumber(missingToNext, language),
                      target: formatNumber(member.nextRewardTarget, language),
                    })
                  : formatTemplate(t.home.rewardGoalReached, {
                      target: formatNumber(member.nextRewardTarget, language),
                    })}
              </p>

              <button
                type="button"
                onClick={onOpenMemberCard}
                className="min-h-[44px] px-4 py-2 rounded-2xl bg-[#FAF7F0] hover:bg-white text-[#293622] text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
              >
                <CreditCard className="w-4 h-4 text-[#4A5D3F]" />
                <span>{t.home.showCard}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Quick Access Grid + Discreet Desktop Install Option */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="rounded-3xl bg-white border border-[#E7DFCC] p-6 flex-1 flex flex-col justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#293622]">
                {t.home.quickActionsTitle}
              </h2>
              <p className="mt-1 text-xs text-[#5A6353]">
                {member.fullName} · {member.favoriteBranch}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onOpenMemberCard}
                className="min-h-[76px] p-4 rounded-2xl bg-[#FAF7F0] hover:bg-[#EAEFE5] border border-[#E7DFCC] text-left transition-colors flex flex-col justify-between gap-2"
              >
                <CreditCard className="w-5 h-5 text-[#4A5D3F]" strokeWidth={1.9} />
                <span className="text-sm font-semibold text-[#293622]">
                  {t.home.actionCard}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('points')}
                className="min-h-[76px] p-4 rounded-2xl bg-[#FAF7F0] hover:bg-[#EAEFE5] border border-[#E7DFCC] text-left transition-colors flex flex-col justify-between gap-2"
              >
                <Award className="w-5 h-5 text-[#4A5D3F]" strokeWidth={1.9} />
                <span className="text-sm font-semibold text-[#293622]">
                  {t.home.actionPoints}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('rewards')}
                className="min-h-[76px] p-4 rounded-2xl bg-[#FAF7F0] hover:bg-[#EAEFE5] border border-[#E7DFCC] text-left transition-colors flex flex-col justify-between gap-2"
              >
                <Gift className="w-5 h-5 text-[#4A5D3F]" strokeWidth={1.9} />
                <span className="text-sm font-semibold text-[#293622]">
                  {t.home.actionRewards}
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenRegister}
                className="min-h-[76px] p-4 rounded-2xl bg-[#FAF7F0] hover:bg-[#EAEFE5] border border-[#E7DFCC] text-left transition-colors flex flex-col justify-between gap-2"
              >
                <UserPlus className="w-5 h-5 text-[#4A5D3F]" strokeWidth={1.9} />
                <span className="text-sm font-semibold text-[#293622]">
                  {t.home.actionRegister}
                </span>
              </button>
            </div>
          </div>

          {/* Discreet Desktop / Browser PWA Install Card (hidden when standalone or dismissed) */}
          {!isInstalled && !desktopBannerHidden && (
            <div className="rounded-2xl bg-[#EAEFE5] border border-[#D4DFC9] p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#293622]">
                  {t.pwa.desktopBannerTitle}
                </p>
                <p className="text-xs text-[#4D5647] mt-0.5 leading-snug">
                  {t.pwa.desktopBannerDesc}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={onInstallPwa}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#4A5D3F] hover:bg-[#38492F] text-[#FAF7F0] text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {isInstallable
                      ? t.pwa.desktopInstallAction
                      : t.pwa.installAppButton}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setDesktopBannerHidden(true)}
                  aria-label={t.common.close}
                  className="min-h-[40px] min-w-[36px] rounded-xl flex items-center justify-center text-[#5A6353] hover:bg-white/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Benefits Section */}
      <section>
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#293622]">
              {t.home.featuredRewardsTitle}
            </h2>
            <p className="mt-1 text-sm text-[#5A6353]">
              {t.home.featuredRewardsSub}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('rewards')}
            className="min-h-[40px] inline-flex items-center gap-1.5 text-sm font-semibold text-[#4A5D3F] hover:text-[#293622] whitespace-nowrap shrink-0 transition-colors"
          >
            <span>{t.common.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRewards.map((reward) => {
            const copy = getRewardCopy(reward, t);
            const unlocked = member.points >= reward.pointsRequired;
            const missing = reward.pointsRequired - member.points;

            return (
              <button
                key={reward.id}
                type="button"
                onClick={() => onSelectReward(reward)}
                className="group text-left rounded-3xl bg-white border border-[#E7DFCC] overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all flex flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A5D3F]"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#F3EDE0]">
                  <SafeImage
                    src={reward.imageUrl}
                    alt={copy.title}
                    fallbackLabel={copy.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#5A6353]">
                      {!reward.title && (
                        <span>{t.rewards.categories[reward.category]}</span>
                      )}
                      {!reward.title && <span aria-hidden="true">·</span>}
                      <span
                        className={
                          unlocked
                            ? 'font-semibold text-[#4A5D3F]'
                            : 'text-[#7B6B43] font-medium'
                        }
                      >
                        {unlocked
                          ? t.common.available
                          : formatTemplate(t.common.missingPoints, {
                              points: formatNumber(missing, language),
                            })}
                      </span>
                    </div>
                    <h3 className="mt-1.5 font-display text-lg font-semibold text-[#293622] leading-snug">
                      {copy.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#5A6353] line-clamp-2">
                      {copy.shortDesc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F0E9D8] flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-[#293622] tabular-nums">
                      {formatNumber(reward.pointsRequired, language)}{' '}
                      {t.common.pointsShort}
                    </span>
                    <span className="text-xs font-semibold text-[#4A5D3F] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                      {t.rewards.simulateRedeemBtn}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="rounded-3xl bg-white border border-[#E7DFCC] p-6 sm:p-7">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#293622]">
              {t.home.recentActivityTitle}
            </h2>
            <p className="mt-1 text-sm text-[#5A6353]">
              {t.home.recentActivitySub}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('history')}
            className="min-h-[40px] inline-flex items-center gap-1.5 text-sm font-semibold text-[#4A5D3F] hover:text-[#293622] whitespace-nowrap shrink-0 transition-colors"
          >
            <span>{t.common.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {recentHistory.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#5A6353]">
            {t.home.noRecentActivity}
          </p>
        ) : (
          <ul className="divide-y divide-[#F0E9D8]">
            {recentHistory.map((item) => {
              const positive = item.pointsDelta >= 0;
              return (
                <li
                  key={item.id}
                  className="py-4 first:pt-2 last:pb-1 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-[#293622] truncate">
                      {resolveHistoryTitle(item)}
                    </p>
                    <p className="mt-0.5 text-xs text-[#5A6353] flex items-center gap-1.5 flex-wrap">
                      <span>{formatDate(item.dateIso, language)}</span>
                      {item.branchName && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{item.branchName}</span>
                        </>
                      )}
                    </p>
                  </div>
                  <span
                    className={`font-mono text-sm sm:text-base font-semibold tabular-nums whitespace-nowrap shrink-0 ${
                      positive ? 'text-[#4A5D3F]' : 'text-[#8C5B32]'
                    }`}
                  >
                    {positive ? '+' : ''}
                    {formatNumber(item.pointsDelta, language)}{' '}
                    {t.common.pointsShort}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};
