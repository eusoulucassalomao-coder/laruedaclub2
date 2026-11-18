import { useCallback, useEffect, useState } from 'react';
import {
  INITIAL_HISTORY,
  INITIAL_MEMBER,
  POINT_MILESTONES,
  REWARDS_CATALOG,
} from '../data/demoData';
import { HistoryEntry, Language, MemberProfile } from '../types';

const STORAGE_KEY = 'club_la_ruedita_demo_v1';

interface PersistedState {
  language: Language;
  member: MemberProfile;
  history: HistoryEntry[];
}

function getNextTarget(points: number): number {
  const next = POINT_MILESTONES.find((m) => m > points);
  return next ?? POINT_MILESTONES[POINT_MILESTONES.length - 1];
}

function loadInitialState(): PersistedState {
  if (typeof window === 'undefined') {
    return {
      language: 'es',
      member: INITIAL_MEMBER,
      history: INITIAL_HISTORY,
    };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        language: 'es',
        member: INITIAL_MEMBER,
        history: INITIAL_HISTORY,
      };
    }
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    const lang: Language =
      parsed.language === 'en' || parsed.language === 'pt' || parsed.language === 'es'
        ? parsed.language
        : 'es';
    return {
      language: lang,
      member: parsed.member ? { ...INITIAL_MEMBER, ...parsed.member } : INITIAL_MEMBER,
      history: Array.isArray(parsed.history) ? parsed.history : INITIAL_HISTORY,
    };
  } catch {
    return {
      language: 'es',
      member: INITIAL_MEMBER,
      history: INITIAL_HISTORY,
    };
  }
}

export function useAppState() {
  const [state, setState] = useState<PersistedState>(() => loadInitialState());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      document.documentElement.lang = state.language;
    } catch {
      // Ignore storage quota issues in restricted preview environments
    }
  }, [state]);

  const setLanguage = useCallback((language: Language) => {
    setState((prev) => ({ ...prev, language }));
  }, []);

  const updateMember = useCallback(
    (patch: Partial<MemberProfile>) => {
      setState((prev) => {
        const nextFullName = patch.fullName ?? prev.member.fullName;
        const firstName = nextFullName.trim().split(/\s+/)[0] || prev.member.firstName;
        return {
          ...prev,
          member: {
            ...prev.member,
            ...patch,
            firstName,
          },
        };
      });
    },
    []
  );

  const simulateRedeemReward = useCallback((rewardId: string): string | null => {
    const reward = REWARDS_CATALOG.find((r) => r.id === rewardId);
    if (!reward) return null;

    let generatedVoucher: string | null = null;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `LR-DEMO-${randomNum}`;

    setState((prev) => {
      if (prev.member.points < reward.pointsRequired) {
        return prev;
      }
      generatedVoucher = code;
      const newPoints = prev.member.points - reward.pointsRequired;
      const todayIso = new Date().toISOString().slice(0, 10);
      const newEntry: HistoryEntry = {
        id: `hist-demo-${Date.now()}`,
        type: 'redeemed',
        pointsDelta: -reward.pointsRequired,
        dateIso: todayIso,
        rewardId: reward.id,
        descriptionKey: 'hist_demo_redemption_desc',
        voucherCode: code,
        branchName: prev.member.favoriteBranch.replace('La Ruedita — ', ''),
      };
      return {
        ...prev,
        member: {
          ...prev.member,
          points: newPoints,
          redeemedPoints: prev.member.redeemedPoints + reward.pointsRequired,
          nextRewardTarget: getNextTarget(newPoints),
        },
        history: [newEntry, ...prev.history],
      };
    });

    return generatedVoucher ?? code;
  }, []);

  const registerDemoAccount = useCallback(
    (payload: {
      fullName: string;
      phone: string;
      birthDate: string;
    }): MemberProfile => {
      const cleanName = payload.fullName.trim();
      const firstName = cleanName.split(/\s+/)[0] || cleanName;
      const prefix = cleanName
        .replace(/[^A-Za-z]/g, '')
        .slice(0, 3)
        .toUpperCase()
        .padEnd(3, 'L');
      const codeNum = Math.floor(1000 + Math.random() * 9000);
      const todayIso = new Date().toISOString().slice(0, 10);
      const ym = todayIso.slice(0, 7);

      const newMember: MemberProfile = {
        id: `member-demo-${Date.now()}`,
        customerCode: `${prefix}${codeNum}`,
        fullName: cleanName,
        firstName,
        email: '',
        phone: payload.phone.trim(),
        birthDate: payload.birthDate,
        memberSince: ym,
        avatarUrl: null,
        points: 100,
        lifetimePoints: 100,
        redeemedPoints: 0,
        nextRewardTarget: 300,
        favoriteBranch: INITIAL_MEMBER.favoriteBranch,
        whatsappOptIn: false,
        notificationsPreviewEnabled: false,
        isCustomDemoAccount: true,
      };

      const welcomeEntry: HistoryEntry = {
        id: `hist-welcome-${Date.now()}`,
        type: 'earned',
        pointsDelta: 100,
        dateIso: todayIso,
        titleKey: 'hist_new_member_title',
        descriptionKey: 'hist_new_member_desc',
        branchName: 'Club La Ruedita',
      };

      setState((prev) => ({
        ...prev,
        member: newMember,
        history: [welcomeEntry],
      }));

      return newMember;
    },
    []
  );

  const switchBackToMaria = useCallback(() => {
    setState((prev) => ({
      ...prev,
      member: INITIAL_MEMBER,
      history: INITIAL_HISTORY,
    }));
  }, []);

  const resetDemoData = useCallback(() => {
    setState((prev) => ({
      language: prev.language,
      member: INITIAL_MEMBER,
      history: INITIAL_HISTORY,
    }));
  }, []);

  return {
    language: state.language,
    member: state.member,
    history: state.history,
    setLanguage,
    updateMember,
    simulateRedeemReward,
    registerDemoAccount,
    switchBackToMaria,
    resetDemoData,
  };
}
