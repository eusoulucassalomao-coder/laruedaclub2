import React, { useState } from 'react';
import {
  Check,
  Download,
  Edit3,
  Globe,
  RotateCcw,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import { BRANCH_OPTIONS } from '../data/demoData';
import {
  formatDate,
  formatMonthYear,
  TranslationDictionary,
} from '../i18n/translations';
import { Language, MemberProfile } from '../types';
import { SafeImage } from '../components/SafeImage';
import { ScreenPreviewsSection } from '../components/ScreenPreviewsSection';

interface ProfileScreenProps {
  member: MemberProfile;
  language: Language;
  t: TranslationDictionary;
  isInstalled: boolean;
  onChangeLanguage: (lang: Language) => void;
  onUpdateMember: (patch: Partial<MemberProfile>) => void;
  onOpenRegister: () => void;
  onSignOut: () => void;
  onInstallPwa: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  member,
  language,
  t,
  isInstalled,
  onChangeLanguage,
  onUpdateMember,
  onOpenRegister,
  onSignOut,
  onInstallPwa,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(member.fullName);
  const [editEmail, setEditEmail] = useState(member.email);
  const [editBirth, setEditBirth] = useState(member.birthDate);
  const [editBranch, setEditBranch] = useState(member.favoriteBranch);
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showFeedback = (message: string) => {
    setFeedbackToast(message);
    window.setTimeout(() => {
      setFeedbackToast((current) => (current === message ? null : current));
    }, 3400);
  };

  const openEditModal = () => {
    setEditName(member.fullName);
    setEditEmail(member.email);
    setEditBirth(member.birthDate);
    setEditBranch(member.favoriteBranch);
    setEditError('');
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    // Nome e nascimento ficam no banco do clube (só a equipe altera); aqui só e-mail e unidade.
    if (editEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail.trim())) {
      setEditError(t.profile.validationError);
      return;
    }

    setEditError('');
    setSaving(true);
    onUpdateMember({
      email: editEmail.trim(),
      favoriteBranch: editBranch,
    });
    setSaving(false);
    setEditModalOpen(false);
    showFeedback(t.profile.saveSuccess);
  };

  const initials = member.fullName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#293622] tracking-tight">
            {t.profile.title}
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-[#5A6353]">
            {t.profile.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={openEditModal}
          className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#4A5D3F] hover:bg-[#38492F] text-[#FAF7F0] text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
        >
          <Edit3 className="w-4 h-4" />
          <span>{t.profile.editProfileBtn}</span>
        </button>
      </div>

      {/* Inline Feedback Toast */}
      {feedbackToast && (
        <div
          role="status"
          className="rounded-2xl bg-[#EAEFE5] border border-[#C9D8BC] px-4 py-3 text-sm font-medium text-[#293622] flex items-center gap-2.5"
        >
          <Check className="w-4 h-4 text-[#4A5D3F] shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Member Identity Card */}
      <section className="rounded-3xl bg-white border border-[#E7DFCC] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-[#F0E9D8]">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-[#EAEFE5] border-2 border-[#E7DFCC] shrink-0 flex items-center justify-center">
            {member.avatarUrl ? (
              <SafeImage
                src={member.avatarUrl}
                alt={member.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-display text-2xl font-semibold text-[#4A5D3F]">
                {initials || 'LR'}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="font-display text-2xl font-semibold text-[#293622]">
              {member.fullName}
            </h2>
            <p className="mt-1 text-sm text-[#5A6353] flex flex-wrap items-center gap-2">
              <span>
                {t.profile.memberIdLabel}:{' '}
                <strong className="font-mono text-[#293622]">
                  {member.customerCode}
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {t.profile.memberSinceLabel}{' '}
                {formatMonthYear(member.memberSince, language)}
              </span>
            </p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <dt className="text-xs font-medium text-[#5A6353]">
              {t.profile.emailLabel}
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[#293622] break-all">
              {member.email}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[#5A6353]">
              {t.profile.birthDateLabel}
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[#293622] tabular-nums">
              {formatDate(member.birthDate, language)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[#5A6353]">
              {t.profile.favoriteBranchLabel}
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[#293622]">
              {member.favoriteBranch}
            </dd>
          </div>
        </dl>
      </section>

      {/* Two-Column Grid: Language & Preferences + Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language & Communication Preferences */}
        <section className="rounded-3xl bg-white border border-[#E7DFCC] p-6 sm:p-7 space-y-6">
          {/* Language Switcher */}
          <div>
            <div className="flex items-center gap-2 text-[#4A5D3F]">
              <Globe className="w-5 h-5" />
              <h2 className="font-display text-xl font-semibold text-[#293622]">
                {t.profile.languageSectionTitle}
              </h2>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[#5A6353]">
              {t.profile.languageSectionDesc}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {(
                [
                  { code: 'es', label: 'Español' },
                  { code: 'en', label: 'English' },
                  { code: 'pt', label: 'Português' },
                ] as const
              ).map((option) => {
                const selected = language === option.code;
                return (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => onChangeLanguage(option.code)}
                    className={`min-h-[44px] px-3 py-2.5 rounded-2xl text-sm font-semibold border transition-all ${
                      selected
                        ? 'bg-[#4A5D3F] text-[#FAF7F0] border-[#4A5D3F]'
                        : 'bg-[#FAF7F0] text-[#293622] border-[#E7DFCC] hover:border-[#4A5D3F]'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred branch */}
          <div className="pt-6 border-t border-[#F0E9D8]">
            <label
              htmlFor="pref-branch"
              className="block text-xs font-semibold text-[#5A6353] mb-1.5"
            >
              {t.profile.favoriteBranchLabel}
            </label>
            <select
              id="pref-branch"
              value={member.favoriteBranch}
              onChange={(e) => onUpdateMember({ favoriteBranch: e.target.value })}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#FAF7F0] border border-[#D8CEB8] text-sm text-[#1F281B] focus:outline-none focus:border-[#4A5D3F]"
            >
              {BRANCH_OPTIONS.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Account & App Settings */}
        <section className="rounded-3xl bg-white border border-[#E7DFCC] p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#293622]">
              {t.profile.settingsTitle}
            </h2>

            <div className="mt-5 divide-y divide-[#F0E9D8]">
              {/* Install PWA Row */}
              <button
                type="button"
                onClick={onInstallPwa}
                disabled={isInstalled}
                className="w-full py-4 first:pt-1 flex items-center justify-between gap-4 text-left hover:opacity-85 disabled:opacity-70 transition-opacity"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EAEFE5] text-[#4A5D3F] flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#293622]">
                      {isInstalled
                        ? t.pwa.installedLabel
                        : t.profile.installPwaRowTitle}
                    </p>
                    <p className="text-xs text-[#5A6353] mt-0.5">
                      {isInstalled
                        ? t.profile.installPwaRowInstalled
                        : t.profile.installPwaRowDesc}
                    </p>
                  </div>
                </div>
              </button>

              {/* Try Customer Registration Flow */}
              <button
                type="button"
                onClick={onOpenRegister}
                className="w-full py-4 flex items-center justify-between gap-4 text-left hover:opacity-85 transition-opacity"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#E7DFCC] text-[#4A5D3F] flex items-center justify-center shrink-0">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#293622]">
                      {t.profile.registerNewAccount}
                    </p>
                    <p className="text-xs text-[#5A6353] mt-0.5">
                      {t.profile.registerNewAccountDesc}
                    </p>
                  </div>
                </div>
              </button>

              {/* Sair da conta neste aparelho (os dados continuam no banco do clube) */}
              {!member.isGuest && (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="w-full py-4 last:pb-1 flex items-center justify-between gap-4 text-left hover:opacity-85 transition-opacity"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#E7DFCC] text-[#5A6353] flex items-center justify-center shrink-0">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#293622]">
                        {t.profile.signOutTitle}
                      </p>
                      <p className="text-xs text-[#5A6353] mt-0.5">
                        {t.profile.signOutDesc}
                      </p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>

          <p className="mt-6 pt-4 border-t border-[#F0E9D8] text-xs text-[#6B7365]">
            {t.common.demoNote}
          </p>
        </section>
      </div>

      {/* Mandatory "Vista previa de pantallas" Interactive Showcase */}
      <ScreenPreviewsSection t={t} />

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1F281B]/50 backdrop-blur-xs sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t.profile.editModalTitle}
        >
          <div
            className="absolute inset-0"
            onClick={() => setEditModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[#FAF7F0] border border-[#E7DFCC] p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#E7DFCC]">
              <h2 className="font-display text-xl font-semibold text-[#293622]">
                {t.profile.editModalTitle}
              </h2>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                aria-label={t.common.close}
                className="min-h-[44px] min-w-[44px] -mr-2 rounded-xl flex items-center justify-center text-[#5A6353] hover:bg-[#F3EDE0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="edit-name"
                  className="block text-xs font-semibold text-[#293622] mb-1.5"
                >
                  {t.profile.fullNameLabel}
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={editName}
                  readOnly
                  disabled
                  className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#F3EDE0] border border-[#D8CEB8] text-sm text-[#5A6353] cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-email"
                  className="block text-xs font-semibold text-[#293622] mb-1.5"
                >
                  {t.profile.emailLabel}
                </label>
                <input
                  id="edit-email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-white border border-[#D8CEB8] text-sm text-[#1F281B] focus:outline-none focus:border-[#4A5D3F]"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-birth"
                  className="block text-xs font-semibold text-[#293622] mb-1.5"
                >
                  {t.profile.birthDateLabel}
                </label>
                <input
                  id="edit-birth"
                  type="date"
                  value={editBirth}
                  readOnly
                  disabled
                  className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#F3EDE0] border border-[#D8CEB8] text-sm text-[#5A6353] cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-branch"
                  className="block text-xs font-semibold text-[#293622] mb-1.5"
                >
                  {t.profile.favoriteBranchLabel}
                </label>
                <select
                  id="edit-branch"
                  value={editBranch}
                  onChange={(e) => setEditBranch(e.target.value)}
                  className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-white border border-[#D8CEB8] text-sm text-[#1F281B] focus:outline-none focus:border-[#4A5D3F]"
                >
                  {BRANCH_OPTIONS.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              {editError && (
                <p className="text-xs font-medium text-[#9E3B2B]">{editError}</p>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="min-h-[48px] px-5 py-2.5 rounded-2xl border border-[#D8CEB8] text-[#293622] hover:bg-[#F3EDE0] text-sm font-medium transition-colors"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 min-h-[48px] px-5 py-2.5 rounded-2xl bg-[#4A5D3F] hover:bg-[#38492F] disabled:opacity-60 text-[#FAF7F0] text-sm font-semibold transition-colors"
                >
                  {saving ? t.common.saving : t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
