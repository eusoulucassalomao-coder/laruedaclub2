import React, { useState } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { Language } from '../types';

interface NotificationActivationModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
}

const COPY = {
  pt: { title: 'Ative as notificações', body: 'Ative as notificações para avisos de recompensas e novidades.', allow: 'Ativar', later: 'Agora não', unavailable: 'Este dispositivo não permite ativar notificações neste navegador.' },
  es: { title: 'Activa las notificaciones', body: 'Activa las notificaciones para recibir avisos de recompensas y novedades.', allow: 'Activar', later: 'Ahora no', unavailable: 'Este dispositivo no permite activar notificaciones en este navegador.' },
  en: { title: 'Enable notifications', body: 'Enable notifications for reward alerts and news.', allow: 'Enable', later: 'Not now', unavailable: 'Notifications are not available in this browser.' },
};

export const NotificationActivationModal: React.FC<NotificationActivationModalProps> = ({ isOpen, language, onClose }) => {
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState(false);
  if (!isOpen) return null;
  const copy = COPY[language];

  const activate = async () => {
    if (typeof Notification === 'undefined') { setError(true); return; }
    setRequesting(true);
    try {
      await Notification.requestPermission();
      onClose();
    } catch {
      setError(true);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#1F281B]/60 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-labelledby="notification-activation-title">
      <div className="w-full max-w-sm rounded-3xl bg-[#FAF7F0] border border-[#E7DFCC] p-7 text-center shadow-2xl">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#EAEFE5] text-[#4A5D3F] flex items-center justify-center"><BellRing className="w-7 h-7" /></div>
        <h2 id="notification-activation-title" className="mt-5 font-display text-2xl font-semibold text-[#293622]">{copy.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#5A6353]">{copy.body}</p>
        {error && <p role="alert" className="mt-3 text-xs text-[#9E3B2B]">{copy.unavailable}</p>}
        <button type="button" onClick={activate} disabled={requesting} className="mt-6 w-full min-h-[50px] rounded-2xl bg-[#4A5D3F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#38492F] disabled:opacity-60"><Bell className="mr-2 inline h-4 w-4" />{requesting ? '…' : copy.allow}</button>
        <button type="button" onClick={onClose} className="mt-2 w-full min-h-[44px] rounded-2xl px-4 py-2 text-sm font-medium text-[#5A6353] hover:bg-[#F3EDE0]">{copy.later}</button>
      </div>
    </div>
  );
};
