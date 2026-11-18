import React from 'react';
import { Cookie, ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface CookieConsentProps {
  isOpen: boolean;
  language: Language;
  title: string;
  body: string[];
  onClose: () => void;
}

const COPY = {
  pt: { intro: 'Usamos armazenamento essencial para manter o aplicativo funcionando. Você pode aceitar somente o necessário ou todos os cookies.', essential: 'Aceitar apenas essenciais', all: 'Aceitar todos' },
  es: { intro: 'Usamos almacenamiento esencial para que la aplicación funcione. Puedes aceptar solo lo necesario o todas las cookies.', essential: 'Aceptar solo esenciales', all: 'Aceptar todas' },
  en: { intro: 'We use essential storage to keep the app working. You can accept only what is necessary or all cookies.', essential: 'Essential only', all: 'Accept all' },
};

export const CookieConsent: React.FC<CookieConsentProps> = ({ isOpen, language, title, body, onClose }) => {
  if (!isOpen) return null;
  const copy = COPY[language];
  const save = (choice: 'essential' | 'all') => {
    window.localStorage.setItem('club-la-ruedita-cookie-consent-v1', JSON.stringify({ choice, savedAt: new Date().toISOString() }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-[#1F281B]/55 backdrop-blur-sm p-3 sm:p-5" role="dialog" aria-modal="true" aria-labelledby="cookie-consent-title">
      <div className="w-full max-w-lg rounded-3xl bg-[#FAF7F0] border border-[#E7DFCC] p-6 sm:p-7 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#EAEFE5] text-[#4A5D3F] flex items-center justify-center"><Cookie className="w-5 h-5" /></div>
          <div><h2 id="cookie-consent-title" className="font-display text-xl font-semibold text-[#293622]">{title}</h2><p className="text-xs text-[#6B7365]">Club La Ruedita</p></div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-[#5A6353]">{copy.intro}</p>
        <div className="mt-4 rounded-2xl bg-white border border-[#E7DFCC] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#293622]"><ShieldCheck className="w-4 h-4 text-[#4A5D3F]" />{language === 'pt' ? 'Como usamos os cookies' : language === 'es' ? 'Cómo usamos las cookies' : 'How we use cookies'}</div>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-[#5A6353]">{body.map((item, index) => <li key={index}>• {item}</li>)}</ul>
        </div>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button type="button" onClick={() => save('essential')} className="min-h-[48px] rounded-2xl border border-[#D8CEB8] px-4 py-3 text-sm font-semibold text-[#293622] hover:bg-[#F3EDE0]">{copy.essential}</button>
          <button type="button" onClick={() => save('all')} className="min-h-[48px] rounded-2xl bg-[#4A5D3F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#38492F]">{copy.all}</button>
        </div>
      </div>
    </div>
  );
};
