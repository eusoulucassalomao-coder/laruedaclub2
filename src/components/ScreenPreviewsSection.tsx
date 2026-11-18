import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Compass,
  Download,
  MoreVertical,
  PlusSquare,
  RotateCcw,
  Share,
} from 'lucide-react';
import { TranslationDictionary } from '../i18n/translations';
import { BrandLogo } from './BrandLogo';

interface ScreenPreviewsSectionProps {
  t: TranslationDictionary;
}

type PreviewTab = 'android' | 'ios-safari' | 'ios-chrome' | 'notifications';

export const ScreenPreviewsSection: React.FC<ScreenPreviewsSectionProps> = ({
  t,
}) => {
  const [activePreview, setActivePreview] = useState<PreviewTab>('android');
  const [androidDemoState, setAndroidDemoState] = useState<'prompt' | 'installed'>('prompt');
  const [notifDemoState, setNotifDemoState] = useState<'idle' | 'allowed' | 'later'>('idle');

  const tabs: { id: PreviewTab; label: string }[] = [
    { id: 'android', label: t.profile.previewTabs.android },
    { id: 'ios-safari', label: t.profile.previewTabs.iosSafari },
    { id: 'ios-chrome', label: t.profile.previewTabs.iosChrome },
    { id: 'notifications', label: t.profile.previewTabs.notifications },
  ];

  return (
    <section
      id="screen-previews-section"
      className="rounded-3xl bg-white border border-[#E7DFCC] p-6 sm:p-8"
    >
      <div className="max-w-2xl">
        <h2 className="font-display text-2xl font-semibold text-[#293622]">
          {t.profile.previewsSectionTitle}
        </h2>
        <p className="mt-1.5 text-sm text-[#5A6353] leading-relaxed">
          {t.profile.previewsSectionDesc}
        </p>
      </div>

      {/* Interactive Device Tab Selector */}
      <div
        className="mt-5 flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-[#F3EDE0] w-fit max-w-full"
        role="tablist"
        aria-label={t.profile.previewsSectionTitle}
      >
        {tabs.map((tab) => {
          const isActive = activePreview === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActivePreview(tab.id)}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white text-[#293622] shadow-xs'
                  : 'text-[#5A6353] hover:text-[#293622]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Preview Stage */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Realistic Mobile Viewport Frame */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-[320px] rounded-[2.25rem] bg-[#1F281B] p-3 shadow-lg">
            {/* Simulated Phone Status Bar */}
            <div className="rounded-[1.75rem] bg-[#FAF7F0] overflow-hidden border border-[#E7DFCC]">
              <div className="px-5 pt-3 pb-2 flex items-center justify-between text-[11px] font-semibold text-[#293622] tabular-nums">
                <span>9:41</span>
                <span className="w-16 h-4 rounded-full bg-[#1F281B]" aria-hidden="true" />
                <span>5G</span>
              </div>

              {/* ANDROID PREVIEW */}
              {activePreview === 'android' && (
                <div className="px-5 pt-4 pb-6 min-h-[410px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#5A6353] pb-3 border-b border-[#E7DFCC]">
                      <span className="font-mono">club.laruedita.app</span>
                      <MoreVertical className="w-3.5 h-3.5" />
                    </div>

                    <div className="mt-6 flex justify-center">
                      <BrandLogo size="sm" />
                    </div>

                    {androidDemoState === 'prompt' ? (
                      <div className="mt-5 text-center">
                        <h3 className="font-display text-lg font-semibold text-[#293622] leading-snug">
                          {t.pwa.androidTitle}
                        </h3>
                        <p className="mt-2 text-xs text-[#5A6353] leading-relaxed">
                          {t.pwa.androidSubtitle}
                        </p>

                        <div className="mt-6 space-y-2.5">
                          <button
                            type="button"
                            onClick={() => setAndroidDemoState('installed')}
                            className="w-full min-h-[46px] px-4 py-2.5 rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] text-[#1F281B] font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            <span>{t.pwa.installAppButton}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setAndroidDemoState('prompt')}
                            className="w-full min-h-[42px] px-4 py-2 rounded-2xl bg-white border border-[#D8CEB8] text-[#293622] font-semibold text-xs hover:bg-[#F3EDE0] transition-colors"
                          >
                            {t.pwa.continueBrowserButton}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-7 text-center">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EAEFE5] text-[#4A5D3F] flex items-center justify-center">
                          <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <p className="mt-4 text-sm font-semibold text-[#293622] leading-snug">
                          {t.profile.androidSimulatedInstalled}
                        </p>
                        <button
                          type="button"
                          onClick={() => setAndroidDemoState('prompt')}
                          className="mt-5 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EAEFE5] text-[#293622] text-xs font-semibold hover:bg-[#dce5d4]"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{t.profile.androidResetPreview}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-center text-[#7B8275] pt-4">
                    Android · Chrome PWA
                  </p>
                </div>
              )}

              {/* IPHONE SAFARI PREVIEW */}
              {activePreview === 'ios-safari' && (
                <div className="px-5 pt-4 pb-4 min-h-[410px] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-center mt-2">
                      <BrandLogo size="sm" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold text-[#293622] text-center leading-snug">
                      {t.pwa.iosSafariTitle}
                    </h3>

                    <ol className="mt-4 space-y-2.5 text-xs text-[#1F281B]">
                      <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-[#E7DFCC]">
                        <Share className="w-4 h-4 text-[#4A5D3F] shrink-0 mt-0.5" />
                        <span>{t.pwa.iosSteps[0]}</span>
                      </li>
                      <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-[#E7DFCC]">
                        <PlusSquare className="w-4 h-4 text-[#4A5D3F] shrink-0 mt-0.5" />
                        <span>{t.pwa.iosSteps[1]}</span>
                      </li>
                      <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-[#E7DFCC]">
                        <CheckCircle2 className="w-4 h-4 text-[#4A5D3F] shrink-0 mt-0.5" />
                        <span>{t.pwa.iosSteps[2]}</span>
                      </li>
                    </ol>
                  </div>

                  {/* Simulated Safari Bottom Bar */}
                  <div className="mt-5 pt-3 border-t border-[#E7DFCC]">
                    <div className="rounded-xl bg-white border border-[#E7DFCC] px-3 py-2 flex items-center justify-between text-[#5A6353]">
                      <span className="text-[11px] font-mono">safari</span>
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#EAEFE5] text-[#4A5D3F]">
                        <Share className="w-4 h-4" />
                      </span>
                      <span className="text-[11px]">club.laruedita.app</span>
                    </div>
                  </div>
                </div>
              )}

              {/* IPHONE CHROME PREVIEW */}
              {activePreview === 'ios-chrome' && (
                <div className="px-5 pt-4 pb-6 min-h-[410px] flex flex-col justify-between">
                  <div>
                    <div className="rounded-xl bg-white border border-[#E7DFCC] px-3 py-2 flex items-center justify-between text-[11px] text-[#5A6353]">
                      <span className="font-mono">Chrome iOS</span>
                      <span>club.laruedita.app</span>
                    </div>

                    <div className="mt-7 w-12 h-12 mx-auto rounded-2xl bg-[#EAEFE5] text-[#4A5D3F] flex items-center justify-center">
                      <Compass className="w-6 h-6" />
                    </div>

                    <h3 className="mt-4 font-display text-lg font-semibold text-[#293622] text-center leading-snug">
                      {t.pwa.iosOtherTitle}
                    </h3>
                    <p className="mt-2 text-xs text-[#5A6353] text-center leading-relaxed">
                      {t.pwa.iosOtherSubtitle}
                    </p>

                    <div className="mt-4 p-3 rounded-xl bg-white border border-[#E7DFCC] text-xs text-[#293622] leading-relaxed">
                      {t.pwa.iosOtherGuide}
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="w-full py-2.5 rounded-xl bg-[#4A5D3F] text-[#FAF7F0] text-xs font-semibold text-center">
                      {t.pwa.continueBrowserButton}
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS VISUAL DEMO PREVIEW (NO REAL PERMISSIONS) */}
              {activePreview === 'notifications' && (
                <div className="px-5 pt-4 pb-6 min-h-[410px] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-center mt-2">
                      <BrandLogo size="sm" />
                    </div>

                    {/* Simulated native-style card */}
                    <div className="mt-6 rounded-2xl bg-white border border-[#D8CEB8] p-4 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-[#EAEFE5] text-[#4A5D3F] flex items-center justify-center mb-3">
                        <Bell className="w-5 h-5" />
                      </div>
                      <h3 className="font-display text-base font-semibold text-[#293622]">
                        {t.profile.notifDemoTitle}
                      </h3>
                      <p className="mt-1.5 text-xs text-[#5A6353] leading-relaxed">
                        {t.profile.notifDemoBody}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setNotifDemoState('later')}
                          className="min-h-[40px] px-2.5 py-2 rounded-xl border border-[#D8CEB8] text-xs font-semibold text-[#5A6353] hover:bg-[#F3EDE0] transition-colors"
                        >
                          {t.profile.notifDemoLater}
                        </button>
                        <button
                          type="button"
                          onClick={() => setNotifDemoState('allowed')}
                          className="min-h-[40px] px-2.5 py-2 rounded-xl bg-[#4A5D3F] hover:bg-[#38492F] text-xs font-semibold text-[#FAF7F0] transition-colors"
                        >
                          {t.profile.notifDemoAllow}
                        </button>
                      </div>
                    </div>

                    {notifDemoState !== 'idle' && (
                      <div className="mt-4 p-3 rounded-xl bg-[#EAEFE5] text-xs text-[#293622] leading-relaxed">
                        {notifDemoState === 'allowed'
                          ? t.profile.notifDemoAllowedFeedback
                          : t.profile.notifDemoLaterFeedback}
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-center text-[#7B8275] pt-4">
                    {t.profile.previewsDisclaimer}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Explanatory Context Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl bg-[#FAF7F0] border border-[#E7DFCC] p-5">
            <h3 className="font-display text-lg font-semibold text-[#293622]">
              {activePreview === 'android' && t.profile.previewTabs.android}
              {activePreview === 'ios-safari' && t.profile.previewTabs.iosSafari}
              {activePreview === 'ios-chrome' && t.profile.previewTabs.iosChrome}
              {activePreview === 'notifications' && t.profile.previewTabs.notifications}
            </h3>

            <p className="mt-2 text-sm text-[#5A6353] leading-relaxed">
              {activePreview === 'android' && t.pwa.androidSubtitle}
              {activePreview === 'ios-safari' && t.pwa.iosSafariSubtitle}
              {activePreview === 'ios-chrome' && t.pwa.iosOtherSubtitle}
              {activePreview === 'notifications' && t.profile.notifDemoBody}
            </p>

            {activePreview === 'android' && (
              <ol className="mt-4 space-y-2 text-xs text-[#4D5647]">
                {t.pwa.androidManualSteps.map((s, idx) => (
                  <li key={s} className="flex items-start gap-2">
                    <span className="font-mono font-semibold text-[#4A5D3F]">
                      0{idx + 1}.
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            )}

            {activePreview === 'ios-safari' && (
              <ol className="mt-4 space-y-2 text-xs text-[#4D5647]">
                {t.pwa.iosSteps.map((s, idx) => (
                  <li key={s} className="flex items-start gap-2">
                    <span className="font-mono font-semibold text-[#4A5D3F]">
                      0{idx + 1}.
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            )}

            {activePreview === 'ios-chrome' && (
              <p className="mt-3 text-xs text-[#4D5647] leading-relaxed">
                {t.pwa.iosOtherGuide}
              </p>
            )}
          </div>

          <p className="text-xs text-[#6B7365] leading-relaxed">
            {t.profile.previewsDisclaimer}
          </p>
        </div>
      </div>
    </section>
  );
};
