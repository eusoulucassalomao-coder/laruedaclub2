import React from 'react';
import { RefreshCw, Wifi, WifiOff, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { TranslationDictionary } from '../i18n/translations';

interface PWAStatusBannersProps {
  t: TranslationDictionary;
}

export const PWAStatusBanners: React.FC<PWAStatusBannersProps> = ({ t }) => {
  const { isOnline, justReconnected } = useOnlineStatus();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError() {
      // Quietly handle restricted iframe SW contexts without disrupting user flow
    },
  });

  if (isOnline && !justReconnected && !needRefresh) {
    return null;
  }

  return (
    <div
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 z-50 flex flex-col gap-2 max-w-sm md:w-full pointer-events-none"
      aria-live="polite"
    >
      {!isOnline && (
        <div className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-[#293622] text-[#FAF7F0] px-4 py-3 shadow-lg border border-[#4A5D3F]">
          <WifiOff className="w-4 h-4 shrink-0 text-[#FACC15]" />
          <p className="text-xs sm:text-sm font-medium leading-snug">
            {t.pwa.offlineBanner}
          </p>
        </div>
      )}

      {isOnline && justReconnected && (
        <div className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-[#4A5D3F] text-[#FAF7F0] px-4 py-3 shadow-lg">
          <Wifi className="w-4 h-4 shrink-0 text-[#FACC15]" />
          <p className="text-xs sm:text-sm font-medium leading-snug">
            {t.pwa.onlineRestored}
          </p>
        </div>
      )}

      {needRefresh && (
        <div className="pointer-events-auto flex items-center justify-between gap-3 rounded-2xl bg-white text-[#1F281B] px-4 py-3 shadow-lg border border-[#E7DFCC]">
          <div className="flex items-center gap-2.5 min-w-0">
            <RefreshCw className="w-4 h-4 shrink-0 text-[#4A5D3F]" />
            <p className="text-xs sm:text-sm font-medium leading-snug">
              {t.pwa.updateAvailable}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => updateServiceWorker(true)}
              className="px-3 py-1.5 rounded-xl bg-[#4A5D3F] text-[#FAF7F0] text-xs font-semibold hover:bg-[#38492F] transition-colors whitespace-nowrap"
            >
              {t.pwa.updateAction}
            </button>
            <button
              type="button"
              onClick={() => setNeedRefresh(false)}
              className="p-1.5 rounded-lg text-[#5A6353] hover:bg-[#F3EDE0] transition-colors"
              aria-label={t.common.close}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
