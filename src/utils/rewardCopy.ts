import { TranslationDictionary } from '../i18n/translations';
import { RewardDefinition } from '../types';

export interface RewardCopy {
  title: string;
  shortDesc: string;
  fullDesc: string;
}

/** Texto do prêmio: usa o que vem do banco; cai na tradução local só para prêmios antigos de exemplo. */
export function getRewardCopy(reward: RewardDefinition, t: TranslationDictionary): RewardCopy {
  if (reward.title) {
    const note = reward.note ?? '';
    return { title: reward.title, shortDesc: note, fullDesc: note };
  }
  return t.rewards.items[reward.id] ?? { title: reward.id, shortDesc: '', fullDesc: '' };
}
