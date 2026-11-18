import { useCallback, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { Layout } from './components/Layout';
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
    simulateRedeemReward,
    registerDemoAccount,
    switchBackToMaria,
    resetDemoData,
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

  const showToast = useCallback((message: string) => {
    setGlobalToast(message);
    window.setTimeout(() => {
      setGlobalToast((current) => (current === message ? null : current));
    }, 3600);
  }, []);

  const handleDismissInstallGate = useCallback(() => {
    setInstallGateDismissed(true);
  }, []);

  const handleNavigate = useCallback((tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleInstallAction = useCallback(async () => {
    if (isInstallable) {
      const result = await install();
      if (result === 'accepted') {
        showToast(t.pwa.installSuccessToast);
        return;
      }
    }
    setInstallGateDismissed(false);
  }, [install, isInstallable, showToast, t.pwa.installSuccessToast]);

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
                history={history}
                language={language}
                t={t}
              />
            )}

            {activeTab === 'rewards' && (
              <RewardsScreen
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
                onSwitchToMaria={switchBackToMaria}
                onResetDemoData={resetDemoData}
                onInstallPwa={handleInstallAction}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Layout>

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
        currentPoints={member.points}
        language={language}
        t={t}
        onClose={() => setSelectedReward(null)}
        onConfirmRedeem={simulateRedeemReward}
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
        onRegister={registerDemoAccount}
      />

      {/* Virtual Assistant Drawer (Header Waving Hand Trigger) */}
      <VirtualAssistantDrawer
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        member={member}
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
