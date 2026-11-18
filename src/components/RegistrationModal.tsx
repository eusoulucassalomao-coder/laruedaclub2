import React, { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { TranslationDictionary } from '../i18n/translations';
import { MemberProfile } from '../types';
import { BrandLogo } from './BrandLogo';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationDictionary;
  onRegister: (payload: {
    fullName: string;
    phone: string;
    birthDate: string;
    consent: boolean;
    ref?: string;
  }) => Promise<MemberProfile>;
}

type LegalDocKey = 'terms' | 'privacy' | 'cookies';

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  t,
  onRegister,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [createdProfile, setCreatedProfile] = useState<MemberProfile | null>(null);
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocKey | null>(null);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setFullName('');
    setPhone('');
    setBirthDate('');
    setConsent(false);
    setSubmitError('');
    setErrors({});
    setSubmitting(false);
    setCreatedProfile(null);
    setActiveLegalDoc(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (fullName.trim().length < 2) {
      nextErrors.fullName = t.registration.errorNameRequired;
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      nextErrors.phone = t.registration.errorPhoneInvalid;
    }
    if (!birthDate) {
      nextErrors.birthDate = t.registration.errorBirthRequired;
    }
    if (!consent) {
      nextErrors.consent = t.registration.errorConsentRequired;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitError('');
    setSubmitting(true);
    try {
      // código de quem convidou, se o link tiver ?ref=
      const ref = new URLSearchParams(window.location.search).get('ref') ?? undefined;
      const profile = await onRegister({
        fullName: fullName.trim(),
        phone: phoneDigits,
        birthDate,
        consent,
        ref,
      });
      setCreatedProfile(profile);
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      setSubmitError(
        message && message !== 'server' && message !== 'network'
          ? message
          : t.registration.errorGeneric
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1F281B]/50 backdrop-blur-xs sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.registration.title}
    >
      <div className="absolute inset-0" onClick={resetAndClose} aria-hidden="true" />

      <div className="relative z-10 w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#FAF7F0] border border-[#E7DFCC] p-6 sm:p-7 shadow-2xl">
        {/* Legal document overlay */}
        {activeLegalDoc ? (
          <div>
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#E7DFCC]">
              <h3 className="font-display text-xl font-semibold text-[#293622]">
                {t.registration.legalDocs[activeLegalDoc].title}
              </h3>
              <button
                type="button"
                onClick={() => setActiveLegalDoc(null)}
                aria-label={t.common.close}
                className="min-h-[44px] min-w-[44px] -mr-2 rounded-xl flex items-center justify-center text-[#5A6353] hover:bg-[#F3EDE0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-[#4D5647] leading-relaxed">
              {t.registration.legalDocs[activeLegalDoc].body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActiveLegalDoc(null)}
              className="mt-6 w-full min-h-[48px] rounded-2xl bg-[#4A5D3F] hover:bg-[#38492F] text-[#FAF7F0] text-sm font-semibold transition-colors"
            >
              {t.common.back}
            </button>
          </div>
        ) : createdProfile ? (
          /* REGISTRATION SUCCESS STATE */
          <div className="text-center py-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EAEFE5] text-[#4A5D3F] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" strokeWidth={1.8} />
            </div>
            <h2 className="font-display text-2xl font-semibold text-[#293622]">
              {t.registration.successTitle}
            </h2>
            <p className="mt-2 text-sm text-[#5A6353]">
              {t.registration.successSubtitle}
            </p>

            <div className="mt-5 rounded-2xl bg-white border border-[#E7DFCC] p-4">
              <p className="text-sm font-semibold text-[#293622]">
                {createdProfile.fullName}
              </p>
              <p className="mt-1 font-mono text-xl font-semibold tracking-wider text-[#4A5D3F] tabular-nums">
                {createdProfile.customerCode}
              </p>
              <p className="mt-2 text-xs text-[#5A6353]">
                {t.registration.successWelcomeBonus}
              </p>
            </div>

            <button
              type="button"
              onClick={resetAndClose}
              className="mt-6 w-full min-h-[48px] rounded-2xl bg-[#4A5D3F] hover:bg-[#38492F] text-[#FAF7F0] text-sm font-semibold transition-colors"
            >
              {t.registration.successContinueBtn}
            </button>
          </div>
        ) : (
          /* SIMPLE MODERN REGISTRATION FORM */
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <BrandLogo size="sm" />
                <h2 className="mt-4 font-display text-2xl font-semibold text-[#293622] leading-tight">
                  {t.registration.title}
                </h2>
                <p className="mt-1.5 text-sm text-[#5A6353]">
                  {t.registration.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={resetAndClose}
                aria-label={t.common.close}
                className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 rounded-xl flex items-center justify-center text-[#5A6353] hover:bg-[#F3EDE0] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="reg-fullname"
                  className="block text-xs font-semibold text-[#293622] mb-1.5"
                >
                  {t.registration.fullNameLabel}
                </label>
                <input
                  id="reg-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.registration.fullNamePlaceholder}
                  className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-white border border-[#D8CEB8] text-sm text-[#1F281B] placeholder:text-[#8A9184] focus:outline-none focus:border-[#4A5D3F]"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-[#9E3B2B] font-medium">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="reg-phone" className="block text-xs font-semibold text-[#293622] mb-1.5">
                  {t.registration.phoneLabel}
                </label>
                <input id="reg-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone}
                  onChange={(e) => setPhone(e.target.value)} placeholder={t.registration.phonePlaceholder}
                  className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-white border border-[#D8CEB8] text-sm text-[#1F281B] placeholder:text-[#8A9184] focus:outline-none focus:border-[#4A5D3F]" />
                {errors.phone && <p className="mt-1 text-xs text-[#9E3B2B] font-medium">{errors.phone}</p>}
              </div>

              <div>
                <label
                  htmlFor="reg-birth"
                  className="block text-xs font-semibold text-[#293622] mb-1.5"
                >
                  {t.registration.birthDateLabel}
                </label>
                <input
                  id="reg-birth"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-white border border-[#D8CEB8] text-sm text-[#1F281B] focus:outline-none focus:border-[#4A5D3F]"
                />
                {errors.birthDate && (
                  <p className="mt-1 text-xs text-[#9E3B2B] font-medium">
                    {errors.birthDate}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-start gap-2.5 text-xs text-[#4D5647] leading-relaxed cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#4A5D3F]"
                  />
                  <span>{t.registration.consentLabel}</span>
                </label>
                {errors.consent && (
                  <p className="mt-1 text-xs text-[#9E3B2B] font-medium">{errors.consent}</p>
                )}
              </div>

              {submitError && (
                <p role="alert" className="text-xs text-[#9E3B2B] font-medium">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[50px] px-5 py-3 rounded-2xl bg-[#4A5D3F] hover:bg-[#38492F] disabled:opacity-60 text-[#FAF7F0] font-semibold text-sm active:scale-[0.98] transition-all"
              >
                {submitting
                  ? t.registration.submittingBtn
                  : t.registration.submitBtn}
              </button>

              {/* Concise Legal Links — No walls of text, no confusing accept/refuse radios */}
              <p className="text-xs text-[#5A6353] text-center leading-relaxed pt-1">
                {t.registration.legalNoticePrefix}{' '}
                <button
                  type="button"
                  onClick={() => setActiveLegalDoc('terms')}
                  className="underline font-medium text-[#293622] hover:text-[#4A5D3F]"
                >
                  {t.registration.termsLink}
                </button>
                ,{' '}
                <button
                  type="button"
                  onClick={() => setActiveLegalDoc('privacy')}
                  className="underline font-medium text-[#293622] hover:text-[#4A5D3F]"
                >
                  {t.registration.privacyLink}
                </button>{' '}
                {t.registration.legalConnectorAnd}{' '}
                <button
                  type="button"
                  onClick={() => setActiveLegalDoc('cookies')}
                  className="underline font-medium text-[#293622] hover:text-[#4A5D3F]"
                >
                  {t.registration.cookiesLink}
                </button>
                .
              </p>

            </form>
          </>
        )}
      </div>
    </div>
  );
};
