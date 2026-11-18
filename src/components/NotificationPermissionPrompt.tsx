import React, { useEffect, useState } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { Language } from '../types';

interface NotificationPermissionPromptProps {
  language: Language;
}

type PromptState = 'hidden' | 'ready' | 'denied' | 'unsupported';

const COPY = {
  es: {
    title: 'Activa las notificaciones',
    body: 'Recibe avisos cuando tengas una nueva recompensa y conoce las novedades de Club La Ruedita.',
    action: 'Activar notificaciones',
    later: 'Continuar sin activar',
    denied: 'Las notificaciones están bloqueadas en este navegador. Puedes habilitarlas desde los ajustes del sitio.',
    unsupported: 'Este navegador no admite notificaciones.',
  },
  en: {
    title: 'Turn on notifications',
    body: 'Get notified when you unlock a new reward and stay up to date with Club La Ruedita.',
    action: 'Enable notifications',
    later: 'Continue without enabling',
    denied: 'Notifications are blocked in this browser. You can enable them in the site settings.',
    unsupported: 'Notifications are not supported by this browser.',
  },
  pt: {
    title: 'Ative as notificações',
    body: 'Receba avisos quando liberar uma nova recompensa e fique por dentro das novidades do Club La Ruedita.',
    action: 'Ativar notificações',
    later: 'Continuar sem ativar',
    denied: 'As notificações estão bloqueadas neste navegador. Você pode ativá-las nas configurações do site.',
    unsupported: 'Este navegador não oferece suporte a notificações.',
  },
} as const;

const STORAGE_KEY = 'la-ruedita-notification-onboarding-dismissed';

export const NotificationPermissionPrompt: React.FC<NotificationPermissionPromptProps> = ({ language }) => {
  const [state, setState] = useState<PromptState>('hidden');
  const copy = COPY[language] ?? COPY.es;

  useEffect(() => {
    if (!('Notification' in window)) {
      setState('unsupported');
      return;
    }

    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
      return;
    }

    try {
      if (window.localStorage.getItem(STORAGE_KEY) !== '1') {
        setState('ready');
      }
    } catch {
      setState('ready');
    }
  }, []);

  const continueWithoutNotifications = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // The prompt can still be dismissed when storage is unavailable.
    }
    setState('hidden');
  };

  const activateNotifications = async () => {
    if (!('Notification' in window)) {
      setState('unsupported');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted' || permission === 'denied') {
        setState('hidden');
      } else {
        // The browser prompt was dismissed; don't repeatedly interrupt the user.
        continueWithoutNotifications();
      }
    } catch {
      setState('unsupported');
    }
  };

  if (state === 'hidden') return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#172016]/75 px-4 py-6 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-onboarding-title"
        className="w-full max-w-md rounded-3xl border border-[#E7DFCC] bg-[#FAF7F0] p-6 text-center shadow-2xl sm:p-8"
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAEFE5] text-[#4A5D3F]">
          {state === 'ready' ? <BellRing className="h-7 w-7" /> : <Bell className="h-7 w-7" />}
        </div>
        <h1 id="notification-onboarding-title" className="font-display text-2xl font-semibold text-[#293622]">
          {state === 'ready' ? copy.title : state === 'denied' ? copy.title : copy.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#5A6353]">
          {state === 'ready' ? copy.body : state === 'denied' ? copy.denied : copy.unsupported}
        </p>
        {state === 'ready' && (
          <button
            type="button"
            onClick={activateNotifications}
            className="mt-7 min-h-[52px] w-full rounded-2xl bg-[#FACC15] px-5 py-3 font-bold text-[#1F281B] shadow-sm transition-colors hover:bg-[#EAB308]"
          >
            {copy.action}
          </button>
        )}
        <button
          type="button"
          onClick={continueWithoutNotifications}
          className="mt-3 min-h-[46px] w-full rounded-2xl border border-[#D8CEB8] px-5 py-3 text-sm font-semibold text-[#293622] transition-colors hover:bg-[#F3EDE0]"
        >
          {copy.later}
        </button>
      </section>
    </div>
  );
};
