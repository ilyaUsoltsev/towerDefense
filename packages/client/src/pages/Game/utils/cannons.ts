const config = {
  dumb: {
    cost: 50,
    range: 0,
    damage: 0,
    fireRate: Infinity,
    upgradeCost: 0,
    projectileSpeed: 0,
    description: 'Башня, которая не стреляет',
  },
  basic: {
    cost: 100,
    range: 100,
    damage: 5,
    fireRate: 1000,
    upgradeCost: 75,
    projectileSpeed: 5,
    description: 'Простая башня с балансированными характеристиками',
  },
  rocket: {
    cost: 150,
    range: 120,
    damage: 50,
    fireRate: 2000,
    upgradeCost: 120,
    projectileSpeed: 4,
    description: 'Поражает область вокруг цели',
  },
  sniper: {
    cost: 200,
    range: 200,
    damage: 75,
    fireRate: 4000,
    upgradeCost: 150,
    projectileSpeed: 10,
    description: 'Большая дальность и урон, но медленная скорострельность',
  },
  freeze: {
    cost: 150,
    range: 80,
    damage: 10,
    fireRate: 1500,
    upgradeCost: 100,
    projectileSpeed: 1,
    description: 'Замедляет врагов при попадании',
  },
} as const;

export type CannonType = keyof typeof config;

export const CannonsConfig = config;
