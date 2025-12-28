export const GameConfig = {
  waveDelay: 10000,
  hp: 10,
  initialMoney: 80,
  tileSize: 32,
  enemy: {
    radius: 10,
    reward: 10,
  },
  spawn: {
    interval: 1000,
    initialCount: 3,
  },
  healthBar: {
    width: 24,
    height: 3,
    offset: 18,
  },
  projectile: {
    radius: 3,
    color: 'orange',
  },
} as const;
