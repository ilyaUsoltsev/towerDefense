const config = {
  dumb: {
    cost: 2,
    range: 0,
    damage: 0,
    fireRate: Infinity,
    upgradeCost: 0,
    projectileSpeed: 0,
    description: 'Башня, которая не стреляет',
    explosionRadius: 0,
  },
  basic: {
    cost: 5,
    range: 60,
    damage: 10,
    fireRate: 1000,
    upgradeCost: 75,
    projectileSpeed: 5,
    description: 'Простая башня с балансированными характеристиками',
    explosionRadius: 0,
  },
  rocket: {
    cost: 20,
    range: 120,
    damage: 50,
    fireRate: 2000,
    upgradeCost: 120,
    projectileSpeed: 4,
    description: 'Поражает область вокруг цели',
    explosionRadius: 50,
  },
  sniper: {
    cost: 40,
    range: 300,
    damage: 50,
    fireRate: 4000,
    upgradeCost: 150,
    projectileSpeed: 10,
    description: 'Большая дальность и урон, но медленная скорострельность',
    explosionRadius: 0,
  },
  freeze: {
    cost: 50,
    range: 80,
    damage: 10,
    fireRate: 1500,
    upgradeCost: 100,
    projectileSpeed: 1,
    description: 'Замедляет врагов при попадании',
    explosionRadius: 0,
  },
} as const;

export type CannonType = keyof typeof config;

export const CannonsConfig = config;
