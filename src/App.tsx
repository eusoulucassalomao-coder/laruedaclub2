import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { Layout } from './components/Layout';
import { CookieConsent } from './components/CookieConsent';
import { NotificationActivationModal } from './components/NotificationActivationModal';
import { MemberCardModal } from './components/MemberCardModal';
import { PWAInstallGate } from './components/PWAInstallGate';
import { PWAStatusBanners } from './components/PWAStatusBanners';
import { RegistrationModal } from './components/RegistrationModal';
import { RewardDetailModal } from './components/RewardDetailModal';
import { VirtualAssistantDrawer } from './components/VirtualAssistantDrawer';
import { useAppState } from './hooks/useAppState';
import { usePWAInstall } from './hooks/usePWAInstall';
import { TRANSLATIONS } from './i18n/translations';
import { HistoryScreen } from './screens/HistoryScreen';
import { HomeScreen } from './screens/HomeScreen';
import { PointsScreen } from './screens/PointsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { RewardsScreen } from './screens/RewardsScreen';
import { RewardDefinition, TabId } from './types';

export default function App() {
  const {
    language,
    member,
    history,
    setLanguage,
    updateMember,
    rewards,
    status,
    redeemReward,
    registerAccount,
    signOut,
  } = useAppState();

  const { platform, isInstallable, isInstalled, install } = usePWAInstall();
  const t = TRANSLATIONS[language];

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [selectedReward, setSelectedReward] = useState<RewardDefinition | null>(
    null
  );
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [memberCardOpen, setMemberCardOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const [installGateDismissed, setInstallGateDismissed] = useState<boolean>(false);
  const [cookieConsentOpen, setCookieConsentOpen] = useState(false);
  const [notificationPromptOpen, setNotificationPromptOpen] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (!isInstalled || !standalone || typeof Notification === 'undefined') return;
    const promptKey = 'club-la-ruedita-notification-prompt-v1';
    if (window.localStorage.getItem(promptKey)) return;
    if (Notification.permission !== 'default') {
      window.localStorage.setItem(promptKey, 'completed');
      return;
    }
    window.localStorage.setItem(promptKey, 'shown');
    setNotificationPromptOpen(true);
  }, [isInstalled]);

  const showToast = useCallback((message: string) => {
    setGlobalToast(message);
    window.setTimeout(() => {
      setGlobalToast((current) => (current === message ? null : current));
    }, 3600);
  }, []);

  const handleDismissInstallGate = useCallback(() => {
    setInstallGateDismissed(true);
    if (!window.localStorage.getItem('club-la-ruedita-cookie-consent-v1')) {
      setCookieConsentOpen(true);
    }
  }, []);

  const handleNavigate = useCallback((tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleInstallAction = useCallback(async () => {
    if (!isInstallable) {
      showToast(t.pwa.installUnavailableToast);
      return;
    }

    const result = await install();
    if (result === 'accepted') {
      showToast(t.pwa.installSuccessToast);
    } else if (result === 'unavailable') {
      showToast(t.pwa.installUnavailableToast);
    }
  }, [install, isInstallable, showToast, t.pwa.installSuccessToast, t.pwa.installUnavailableToast]);

  return (
    <MotionConfig reducedMotion="user">
      {/* Device-aware initial install screen (suppressed automatically in standalone mode) */}
      <PWAInstallGate
        platform={platform}
        isInstalled={isInstalled}
        isInstallable={isInstallable}
        dismissed={installGateDismissed}
        language={language}
        onChangeLanguage={setLanguage}
        onInstall={install}
        onContinueInBrowser={handleDismissInstallGate}
        t={t}
      />

      <Layout
        activeTab={activeTab}
        onSelectTab={handleNavigate}
        onOpenAssistant={() => setAssistantOpen(true)}
        t={t}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'home' && (
              <HomeScreen
                member={member}
                history={history}
                rewards={rewards}
                language={language}
                t={t}
                isInstalled={isInstalled}
                isInstallable={isInstallable}
                onInstallPwa={handleInstallAction}
                onNavigate={handleNavigate}
                onSelectReward={setSelectedReward}
                onOpenMemberCard={() => setMemberCardOpen(true)}
                onOpenRegister={() => setRegisterOpen(true)}
              />
            )}

            {activeTab === 'points' && (
              <PointsScreen
                member={member}
                rewards={rewards}
                history={history}
                language={language}
                t={t}
              />
            )}

            {activeTab === 'rewards' && (
              <RewardsScreen
                rewards={rewards}
                currentPoints={member.points}
                language={language}
                t={t}
                onSelectReward={setSelectedReward}
              />
            )}

            {activeTab === 'history' && (
              <HistoryScreen history={history} language={language} t={t} />
            )}

            {activeTab === 'profile' && (
              <ProfileScreen
                member={member}
                language={language}
                t={t}
                isInstalled={isInstalled}
                onChangeLanguage={setLanguage}
                onUpdateMember={updateMember}
                onOpenRegister={() => setRegisterOpen(true)}
                onSignOut={signOut}
                onInstallPwa={handleInstallAction}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Layout>

      <CookieConsent
        isOpen={cookieConsentOpen}
        language={language}
        title={t.registration.legalDocs.cookies.title}
        body={t.registration.legalDocs.cookies.body}
        onClose={() => setCookieConsentOpen(false)}
      />

      <NotificationActivationModal
        isOpen={notificationPromptOpen}
        language={language}
        onClose={() => setNotificationPromptOpen(false)}
      />

      {status === 'error' && (
        <div
          role="alert"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md rounded-2xl bg-[#9E3B2B] text-white px-4 py-3 text-sm font-medium shadow-lg text-center"
        >
          {t.common.connectionError}
        </div>
      )}

      {/* Global Toast Notification */}
      {globalToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md rounded-2xl bg-[#293622] text-[#FAF7F0] px-4 py-3 text-sm font-medium shadow-lg text-center"
        >
          {globalToast}
        </div>
      )}

      {/* Reward Details & Demo Redemption Modal */}
      <RewardDetailModal
        reward={selectedReward}
        isGuest={member.isGuest === true}
        onOpenRegister={() => {
          setSelectedReward(null);
          setRegisterOpen(true);
        }}
        currentPoints={member.points}
        language={language}
        t={t}
        onClose={() => setSelectedReward(null)}
        onConfirmRedeem={redeemReward}
      />

      {/* Digital Member Pass Modal */}
      <MemberCardModal
        isOpen={memberCardOpen}
        onClose={() => setMemberCardOpen(false)}
        member={member}
        language={language}
        t={t}
      />

      {/* Customer Demo Registration Modal */}
      <RegistrationModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        t={t}
        onRegister={registerAccount}
      />

      {/* Virtual Assistant Drawer (Header Waving Hand Trigger) */}
      <VirtualAssistantDrawer
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        member={member}
        rewards={rewards}
        language={language}
        t={t}
        onNavigate={handleNavigate}
        onOpenRegister={() => setRegisterOpen(true)}
      />

      {/* Offline / Reconnected / App Update Banners */}
      <PWAStatusBanners t={t} />
    </MotionConfig>
  );
}
