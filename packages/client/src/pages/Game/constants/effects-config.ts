import { CannonType } from './cannons-config';

type EffectName = 'Freeze' | '';

export type Effect = {
  magnitude: number;
  duration: number;
  name: EffectName;
  timepassed: number;
};

export const EffectsConfig: Record<CannonType, Effect | null> = {
  freeze: {
    magnitude: 0.7,
    duration: 1000,
    name: 'Freeze',
    timepassed: 0,
  },
  dumb: null,
  basic: null,
  fast: null,
  rocket: null,
  sniper: null,
} as const;

export type EffectType = CannonType;
