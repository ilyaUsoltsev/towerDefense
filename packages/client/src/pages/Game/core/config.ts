export const GameConfig = {
  hp: 10,
  initialMoney: 1500,
  tileSize: 32,
  enemy: {
    defaultSpeed: 1,
    defaultHealth: 100,
    radius: 10,
    reward: 10,
  },
  cannon: {
    defaultRange: 64,
    fireRate: 1000,
    projectileSpeed: 5,
    damage: 5,
    cost: 100,
  },
  spawn: {
    interval: 2000,
    initialCount: 3,
  },
  healthBar: {
    width: 30,
    height: 4,
    offset: 18,
  },
  projectile: {
    radius: 4,
    color: 'orange',
  },
} as const;
