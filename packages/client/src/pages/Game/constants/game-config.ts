export const GameConfig = {
  waveDelay: 10000,
  hp: 10,
  initialMoney: 80,
  tileSize: 32,
  maxCannonLevel: 5,
  healthBar: {
    width: 24,
    height: 3,
    offset: 18,
  },
  projectile: {
    radius: 3,
    color: 'orange',
  },
  sellValue: 0.7,
} as const;
