import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Compass,
  Download,
  Globe,
  PlusSquare,
  Share,
  Smartphone,
} from 'lucide-react';
import { TranslationDictionary } from '../i18n/translations';
import { DevicePlatform, Language } from '../types';
import { BrandLogo } from './BrandLogo';

interface PWAInstallGateProps {
  platform: DevicePlatform;
  isInstalled: boolean;
  isInstallable: boolean;
  dismissed: boolean;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  onInstall: () => Promise<'accepted' | 'dismissed' | 'unavailable'>;
  onContinueInBrowser: () => void;
  t: TranslationDictionary;
}

type InstallViewMode = 'android' | 'ios-safari' | 'ios-other';

function resolveInitialMode(platform: DevicePlatform): InstallViewMode {
  if (platform === 'ios-safari') return 'ios-safari';
  if (platform === 'ios-other') return 'ios-other';
  return 'android';
}

export const PWAInstallGate: React.FC<PWAInstallGateProps> = ({
  platform,
  isInstalled,
  isInstallable,
  dismissed,
  language,
  onChangeLanguage,
  onInstall,
  onContinueInBrowser,
  t,
}) => {
  const [viewMode, setViewMode] = useState<InstallViewMode>(() =>
    resolveInitialMode(platform)
  );
  const [showManualSteps, setShowManualSteps] = useState(false);

  useEffect(() => {
    setViewMode(resolveInitialMode(platform));
  }, [platform]);

  // Never show when already launched as an installed standalone PWA or once dismissed
  if (isInstalled || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await onInstall();
      if (outcome === 'accepted') {
        onContinueInBrowser();
        return;
      }
      if (outcome === 'unavailable') {
        setShowManualSteps(true);
      }
    } else {
      setShowManualSteps(true);
    }
  };

  const deviceOptions: { id: InstallViewMode; label: string }[] = [
    { id: 'android', label: t.profile.previewTabs.android },
    { id: 'ios-safari', label: t.profile.previewTabs.iosSafari },
    { id: 'ios-other', label: t.profile.previewTabs.iosChrome },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F0] overflow-y-auto flex flex-col justify-between px-4 sm:px-6 py-6 sm:py-10">
      {/* Top Bar: Language Switcher */}
      <div className="max-w-lg w-full mx-auto flex items-center justify-between gap-3">
        <BrandLogo size="md" />
        <div
          className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#F3EDE0] border border-[#E7DFCC]"
          aria-label={t.profile.languageSectionTitle}
        >
          <Globe className="w-3.5 h-3.5 text-[#5A6353] ml-1.5 mr-0.5 hidden sm:block" />
          {(['es', 'en', 'pt'] as const).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => onChangeLanguage(code)}
              className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold uppercase transition-colors ${
                language === code
                  ? 'bg-[#4A5D3F] text-[#FAF7F0]'
                  : 'text-[#5A6353] hover:text-[#293622]'
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Main Centered Install Card */}
      <div className="max-w-lg w-full mx-auto my-6 flex-1 flex flex-col justify-center">
        {/* Device Mode Selector: visible ONLY on desktop/preview so real Android/iOS users see exclusively their own device screen */}
        {platform === 'desktop' && (
          <div className="mb-4 flex flex-col items-center">
            <span className="text-xs font-medium text-[#5A6353] mb-2">
              {t.pwa.deviceSwitchLabel}
            </span>
            <div
              className="inline-flex items-center gap-1 p-1 rounded-2xl bg-[#F3EDE0] border border-[#E7DFCC] max-w-full overflow-x-auto"
              role="tablist"
              aria-label={t.pwa.deviceSwitchLabel}
            >
              {deviceOptions.map((opt) => {
                const active = viewMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setViewMode(opt.id);
                      setShowManualSteps(false);
                    }}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                      active
                        ? 'bg-white text-[#293622] shadow-xs'
                        : 'text-[#5A6353] hover:text-[#293622]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ANDROID / INSTALLABLE PWA VIEW */}
        {viewMode === 'android' && (
          <div className="rounded-3xl bg-white border border-[#E7DFCC] p-6 sm:p-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#EAEFE5] text-[#4A5D3F] flex items-center justify-center mb-5">
              <Smartphone className="w-6 h-6" strokeWidth={1.8} />
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#293622] leading-tight text-balance">
              {t.pwa.androidTitle}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#5A6353] leading-relaxed">
              {t.pwa.androidSubtitle}
            </p>

            <div className="mt-7 flex flex-col gap-3">
              {/* Highlighted Yellow Install App Button */}
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full min-h-[54px] px-5 py-3.5 rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] text-[#1F281B] font-bold text-base shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
              >
                <Download className="w-5 h-5" strokeWidth={2.2} />
                <span>{t.pwa.installAppButton}</span>
              </button>

              {/* Secondary Continue in Browser Button */}
              <button
                type="button"
                onClick={onContinueInBrowser}
                className="w-full min-h-[48px] px-5 py-3 rounded-2xl bg-transparent border border-[#D8CEB8] text-[#293622] font-semibold text-sm hover:bg-[#F3EDE0] transition-colors"
              >
                {t.pwa.continueBrowserButton}
              </button>
            </div>

            {showManualSteps && (
              <div className="mt-6 pt-5 border-t border-[#E7DFCC]">
                <h2 className="font-sans text-sm font-semibold text-[#293622] mb-3">
                  {t.pwa.androidManualTitle}
                </h2>
                <ol className="space-y-2.5 text-sm text-[#5A6353]">
                  {t.pwa.androidManualSteps.map((step, index) => (
                    <li key={step} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#4A5D3F] text-[#FAF7F0] text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        {/* IPHONE SAFARI VISUAL TUTORIAL VIEW */}
        {viewMode === 'ios-safari' && (
          <div className="rounded-3xl bg-white border border-[#E7DFCC] p-6 sm:p-8 shadow-sm">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#293622] leading-tight text-balance">
              {t.pwa.iosSafariTitle}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#5A6353] leading-relaxed">
              {t.pwa.iosSafariSubtitle}
            </p>

            <ol className="mt-6 space-y-3.5">
              <li className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E7DFCC]">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E7DFCC] flex items-center justify-center text-[#4A5D3F] shrink-0">
                  <Share className="w-5 h-5" />
                </div>
                <p className="text-sm text-[#1F281B] leading-snug pt-0.5">
                  <span className="font-semibold text-[#4A5D3F] mr-1">1.</span>
                  {t.pwa.iosSteps[0]}
                </p>
              </li>

              <li className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E7DFCC]">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E7DFCC] flex items-center justify-center text-[#4A5D3F] shrink-0">
                  <PlusSquare className="w-5 h-5" />
                </div>
                <p className="text-sm text-[#1F281B] leading-snug pt-0.5">
                  <span className="font-semibold text-[#4A5D3F] mr-1">2.</span>
                  {t.pwa.iosSteps[1]}
                </p>
              </li>

              <li className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E7DFCC]">
                <div className="w-10 h-10 rounded-xl bg-[#4A5D3F] flex items-center justify-center text-[#FAF7F0] shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-sm text-[#1F281B] leading-snug pt-0.5">
                  <span className="font-semibold text-[#4A5D3F] mr-1">3.</span>
                  {t.pwa.iosSteps[2]}
                </p>
              </li>
            </ol>

            {/* Visual Safari Share Toolbar Hint */}
            <div className="mt-5 rounded-2xl bg-[#F3EDE0] border border-[#E7DFCC] px-4 py-2.5 flex items-center justify-between text-xs text-[#5A6353]">
              <span className="font-mono">Safari · iOS</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#4A5D3F]">
                <Share className="w-4 h-4" />
                <span>→</span>
                <PlusSquare className="w-4 h-4" />
              </span>
            </div>

            <button
              type="button"
              onClick={onContinueInBrowser}
              className="mt-6 w-full min-h-[50px] px-5 py-3 rounded-2xl bg-[#4A5D3F] hover:bg-[#38492F] text-[#FAF7F0] font-semibold text-sm transition-colors"
            >
              {t.pwa.continueBrowserButton}
            </button>
          </div>
        )}

        {/* IPHONE OTHER BROWSER (CHROME / ETC.) VIEW */}
        {viewMode === 'ios-other' && (
          <div className="rounded-3xl bg-white border border-[#E7DFCC] p-6 sm:p-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#EAEFE5] text-[#4A5D3F] flex items-center justify-center mb-5">
              <Compass className="w-6 h-6" strokeWidth={1.8} />
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#293622] leading-tight text-balance">
              {t.pwa.iosOtherTitle}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#5A6353] leading-relaxed">
              {t.pwa.iosOtherSubtitle}
            </p>

            <div className="mt-5 p-4 rounded-2xl bg-[#FAF7F0] border border-[#E7DFCC] text-sm text-[#293622] leading-relaxed">
              {t.pwa.iosOtherGuide}
            </div>

            <button
              type="button"
              onClick={onContinueInBrowser}
              className="mt-7 w-full min-h-[50px] px-5 py-3 rounded-2xl bg-[#4A5D3F] hover:bg-[#38492F] text-[#FAF7F0] font-semibold text-sm transition-colors"
            >
              {t.pwa.continueBrowserButton}
            </button>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-[#6B7365]">
        Club La Ruedita · {t.common.demoNote}
      </p>
    </div>
  );
};
