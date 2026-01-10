export const CannonsConfig = {
  dumb: {
    cost: 2,
    range: 0,
    damage: 0,
    fireRate: Infinity,
    upgradeCost: 0,
    projectileSpeed: 0,
    name: 'Wall',
    explosionRadius: 0,
    imagePath: '/dumb.png',
  },
  basic: {
    cost: 5,
    range: 60,
    damage: 10,
    fireRate: 1500,
    upgradeCost: 5,
    projectileSpeed: 5,
    name: 'Basic',
    explosionRadius: 0,
    imagePath: '/basic.png',
  },
  fast: {
    cost: 15,
    range: 70,
    damage: 5,
    fireRate: 700,
    upgradeCost: 20,
    projectileSpeed: 7,
    name: 'Fast Shooter',
    explosionRadius: 0,
    imagePath: '/fast.png',
  },
  rocket: {
    cost: 20,
    range: 90,
    damage: 8,
    fireRate: 1500,
    upgradeCost: 20,
    projectileSpeed: 3,
    name: 'Rocket Launcher',
    explosionRadius: 50,
    imagePath: '/rocket.png',
  },
  sniper: {
    cost: 50,
    range: 100,
    damage: 50,
    fireRate: 4000,
    upgradeCost: 50,
    projectileSpeed: 15,
    name: 'Sniper',
    explosionRadius: 0,
    imagePath: '/sniper.png',
  },
  freeze: {
    cost: 50,
    range: 80,
    damage: 0,
    fireRate: 2000,
    upgradeCost: 50,
    projectileSpeed: 5,
    name: 'Freezer',
    explosionRadius: 50,
    imagePath: '/freeze.png',
  },
} as const;

export type CannonType = keyof typeof CannonsConfig;

export const CannonTypes: CannonType[] = Object.keys(
  CannonsConfig
) as CannonType[];
