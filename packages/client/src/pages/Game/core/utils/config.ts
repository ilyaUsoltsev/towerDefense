export const GameConfig = {
  hp: 10,
  initialMoney: 80,
  tileSize: 32,
  enemy: {
    defaultSpeed: 1,
    defaultHealth: 20,
    radius: 10,
    reward: 10,
  },
  spawn: {
    interval: 1000,
    initialCount: 3,
  },
  healthBar: {
    width: 30,
    height: 4,
    offset: 18,
  },
  projectile: {
    radius: 3,
    color: 'orange',
  },
} as const;
