// Cliente da API /api/fid (Netlify Function). O navegador nunca fala direto com o banco.
export const RESTAURANT_SLUG = 'laruedita';

export class FidApiError extends Error {
  code: string;
  status: number;
  constructor(message: string, code: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function call<T>(body: Record<string, unknown>): Promise<T> {
  let response: Response;
  try {
    response = await fetch('/api/fid', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug: RESTAURANT_SLUG, ...body }),
    });
  } catch {
    throw new FidApiError('network', 'network', 0);
  }
  let data: Record<string, unknown> = {};
  try {
    data = await response.json();
  } catch {
    // resposta sem JSON
  }
  if (!response.ok) {
    throw new FidApiError(
      String(data.message || 'server'),
      String(data.error || 'server'),
      response.status
    );
  }
  return data as T;
}

export interface ApiReward {
  id: string;
  name: string;
  pts: number;
  note?: string;
  img?: string;
}

export interface ApiConfig {
  name: string;
  config: { rewards?: ApiReward[]; earn?: { points: number; perAmount: number } };
}

export interface ApiCustomer {
  id: string;
  name: string;
  phone: string;
  code: string;
  birthday: string | null;
  points: number;
  lifetime: number;
  visits: number;
  lastVisit: string | null;
  createdAt: string;
}

export interface ApiLedgerRow {
  points: number;
  type: string;
  note: string | null;
  created_at: string;
}

export interface ApiRedemption {
  name: string;
  points: number;
  code: string;
  status: string;
  created_at: string;
}

export interface ApiMe {
  customer: ApiCustomer;
  history: ApiLedgerRow[];
  redemptions: ApiRedemption[];
}

export interface RegisterPayload {
  name: string;
  phone: string;
  birthday: string;
  consent: boolean;
  waConsent: boolean;
  ref?: string;
}

export const fidApi = {
  config: () => call<ApiConfig>({ action: 'config' }),
  register: (payload: RegisterPayload) =>
    call<{ customer: ApiCustomer; token: string }>({ action: 'register', ...payload }),
  me: (token: string) => call<ApiMe>({ action: 'me', token }),
  claim: (token: string, reward: string) =>
    call<{ redemption: { code: string; name: string; points?: number; pts?: number } }>({
      action: 'claim',
      token,
      reward,
    }),
  lookupCode: (code: string) =>
    call<{
      customer: { name: string; code: string; points: number };
      redemptions: ApiRedemption[];
    }>({ action: 'lookup_code', code }),
};
