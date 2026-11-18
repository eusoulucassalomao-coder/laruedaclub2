import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ApiConfig,
  ApiCustomer,
  ApiMe,
  ApiReward,
  FidApiError,
  fidApi,
} from '../api/fid';
import { HistoryEntry, Language, MemberProfile, RewardDefinition } from '../types';

const LEGACY_DEMO_KEY = 'club_la_ruedita_demo_v1';
const PREFS_KEY = 'club_la_ruedita_prefs_v2';
const TOKEN_KEY = 'club-la-ruedita-token-v1';

/** Preferências que o banco ainda não guarda (ficam só neste aparelho). */
interface LocalPrefs {
  language: Language;
  email: string;
  favoriteBranch: string;
  whatsappOptIn: boolean;
  notificationsPreviewEnabled: boolean;
}

const DEFAULT_PREFS: LocalPrefs = {
  language: 'es',
  email: '',
  favoriteBranch: 'La Ruedita — Casa Central',
  whatsappOptIn: false,
  notificationsPreviewEnabled: false,
};

const GUEST_NAME: Record<Language, string> = {
  es: 'invitado',
  en: 'guest',
  pt: 'convidado',
};

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // armazenamento indisponível (modo privado etc.)
  }
}

function loadPrefs(): LocalPrefs {
  const isLang = (v: unknown): v is Language => v === 'es' || v === 'en' || v === 'pt';
  let prefs = { ...DEFAULT_PREFS };
  try {
    const raw = readStorage(PREFS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LocalPrefs>;
      prefs = {
        ...prefs,
        ...parsed,
        language: isLang(parsed.language) ? parsed.language : prefs.language,
      };
    } else {
      // migra só o idioma do estado de demonstração antigo
      const legacy = readStorage(LEGACY_DEMO_KEY);
      if (legacy) {
        const parsed = JSON.parse(legacy) as { language?: unknown };
        if (isLang(parsed.language)) prefs.language = parsed.language;
      }
    }
  } catch {
    // ignora JSON inválido
  }
  // dados fictícios antigos não devem continuar no aparelho
  writeStorage(LEGACY_DEMO_KEY, null);
  return prefs;
}

function toRewards(list: ApiReward[] | undefined): RewardDefinition[] {
  return (list ?? [])
    .filter((r) => r && r.id && Number(r.pts) > 0)
    .map((r, index) => ({
      id: r.id,
      pointsRequired: Number(r.pts),
      category: 'cafe' as const,
      imageUrl: r.img ? (r.img.startsWith('/') ? r.img : `/${r.img}`) : '/assets/logo.webp',
      featured: index < 3,
      codePrefix: 'P',
      title: r.name,
      note: r.note ?? '',
    }))
    .sort((a, b) => a.pointsRequired - b.pointsRequired);
}

function nextTarget(points: number, rewards: RewardDefinition[]): number {
  if (rewards.length === 0) return Math.max(points, 1);
  const next = rewards.find((r) => r.pointsRequired > points);
  return (next ?? rewards[rewards.length - 1]).pointsRequired;
}

function toMember(
  customer: ApiCustomer,
  rewards: RewardDefinition[],
  prefs: LocalPrefs
): MemberProfile {
  const firstName = customer.name.trim().split(/\s+/)[0] || customer.name;
  return {
    id: customer.id,
    customerCode: customer.code,
    fullName: customer.name,
    firstName,
    email: prefs.email,
    phone: customer.phone,
    birthDate: customer.birthday ?? '',
    memberSince: (customer.createdAt || '').slice(0, 7),
    avatarUrl: null,
    points: customer.points,
    lifetimePoints: customer.lifetime,
    redeemedPoints: Math.max(0, customer.lifetime - customer.points),
    nextRewardTarget: nextTarget(customer.points, rewards),
    favoriteBranch: prefs.favoriteBranch,
    whatsappOptIn: prefs.whatsappOptIn,
    notificationsPreviewEnabled: prefs.notificationsPreviewEnabled,
    isGuest: false,
  };
}

function guestMember(language: Language, prefs: LocalPrefs, rewards: RewardDefinition[]): MemberProfile {
  return {
    id: '',
    customerCode: '—',
    fullName: '',
    firstName: GUEST_NAME[language],
    email: '',
    phone: '',
    birthDate: '',
    memberSince: new Date().toISOString().slice(0, 7),
    avatarUrl: null,
    points: 0,
    lifetimePoints: 0,
    redeemedPoints: 0,
    nextRewardTarget: nextTarget(0, rewards),
    favoriteBranch: prefs.favoriteBranch,
    whatsappOptIn: false,
    notificationsPreviewEnabled: prefs.notificationsPreviewEnabled,
    isGuest: true,
  };
}

function toHistory(me: ApiMe): HistoryEntry[] {
  const used = new Set<string>();
  return me.history.map((row, index) => {
    const delta = Number(row.points) || 0;
    const entry: HistoryEntry = {
      id: `${row.created_at}-${index}`,
      type: delta >= 0 ? 'earned' : 'redeemed',
      pointsDelta: delta,
      dateIso: String(row.created_at || '').slice(0, 10),
      customTitle: row.note || row.type || undefined,
    };
    if (delta < 0) {
      // liga o extrato ao código do prêmio correspondente
      const match = me.redemptions.find(
        (r) => !used.has(r.code) && r.points === -delta && (row.note ?? '').includes(r.name)
      ) ?? me.redemptions.find((r) => !used.has(r.code) && r.points === -delta);
      if (match) {
        used.add(match.code);
        entry.voucherCode = match.code;
        if (match.status === 'canjeado') entry.type = 'used';
      }
    }
    return entry;
  });
}

export type LoadStatus = 'loading' | 'ready' | 'error';

export function useAppState() {
  const [prefs, setPrefs] = useState<LocalPrefs>(() => loadPrefs());
  const [rewards, setRewards] = useState<RewardDefinition[]>([]);
  const [customer, setCustomer] = useState<ApiMe | null>(null);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const tokenRef = useRef<string>(readStorage(TOKEN_KEY) ?? '');
  const rewardsRef = useRef<RewardDefinition[]>([]);

  // idioma / preferências locais
  useEffect(() => {
    writeStorage(PREFS_KEY, JSON.stringify(prefs));
    document.documentElement.lang = prefs.language;
  }, [prefs]);

  const applyMe = useCallback((me: ApiMe | null) => {
    setCustomer(me);
  }, []);

  const refresh = useCallback(async () => {
    const token = tokenRef.current;
    if (!token) {
      applyMe(null);
      return;
    }
    try {
      applyMe(await fidApi.me(token));
    } catch (error) {
      // link/token inválido: volta ao estado de visitante
      if (error instanceof FidApiError && error.status === 401) {
        tokenRef.current = '';
        writeStorage(TOKEN_KEY, null);
        applyMe(null);
      } else {
        throw error;
      }
    }
  }, [applyMe]);

  // carga inicial: prêmios reais + cliente (se houver sessão)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cfg: ApiConfig = await fidApi.config();
        if (cancelled) return;
        const list = toRewards(cfg.config?.rewards);
        rewardsRef.current = list;
        setRewards(list);
        await refresh();
        if (!cancelled) setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const member = useMemo<MemberProfile>(
    () =>
      customer
        ? toMember(customer.customer, rewards, prefs)
        : guestMember(prefs.language, prefs, rewards),
    [customer, rewards, prefs]
  );

  const history = useMemo<HistoryEntry[]>(
    () => (customer ? toHistory(customer) : []),
    [customer]
  );

  const setLanguage = useCallback((language: Language) => {
    setPrefs((prev) => ({ ...prev, language }));
  }, []);

  /** Só preferências locais (e-mail, unidade, avisos). Nome/telefone/nascimento vivem no banco. */
  const updateMember = useCallback((patch: Partial<MemberProfile>) => {
    setPrefs((prev) => ({
      ...prev,
      email: patch.email ?? prev.email,
      favoriteBranch: patch.favoriteBranch ?? prev.favoriteBranch,
      whatsappOptIn: patch.whatsappOptIn ?? prev.whatsappOptIn,
      notificationsPreviewEnabled:
        patch.notificationsPreviewEnabled ?? prev.notificationsPreviewEnabled,
    }));
  }, []);

  /** Resgate real: o servidor valida os pontos e devolve o código do prêmio. */
  const redeemReward = useCallback(
    async (rewardId: string): Promise<string> => {
      const token = tokenRef.current;
      if (!token) throw new FidApiError('guest', 'guest', 401);
      const result = await fidApi.claim(token, rewardId);
      await refresh().catch(() => undefined);
      return result.redemption.code;
    },
    [refresh]
  );

  /** Cadastro real. Guarda o token e carrega o perfil. */
  const registerAccount = useCallback(
    async (payload: {
      fullName: string;
      phone: string;
      birthDate: string;
      consent: boolean;
      ref?: string;
    }): Promise<MemberProfile> => {
      const result = await fidApi.register({
        name: payload.fullName,
        phone: payload.phone,
        birthday: payload.birthDate,
        consent: payload.consent,
        waConsent: payload.consent,
        ref: payload.ref,
      });
      tokenRef.current = result.token;
      writeStorage(TOKEN_KEY, result.token);
      const me = await fidApi.me(result.token);
      applyMe(me);
      return toMember(me.customer, rewardsRef.current, prefs);
    },
    [applyMe, prefs]
  );

  /** Sai da conta neste aparelho (os dados continuam no banco). */
  const signOut = useCallback(() => {
    tokenRef.current = '';
    writeStorage(TOKEN_KEY, null);
    applyMe(null);
  }, [applyMe]);

  return {
    language: prefs.language,
    member,
    history,
    rewards,
    status,
    isGuest: !customer,
    setLanguage,
    updateMember,
    redeemReward,
    registerAccount,
    signOut,
    refresh,
  };
}
