export const wavesConfig = [
  { enemyType: 'normal', count: 5, spawnInterval: 500, hp: 20, reward: 5 },
  { enemyType: 'fast', count: 5, spawnInterval: 300, hp: 30, reward: 7 },
  { enemyType: 'immune', count: 5, spawnInterval: 500, hp: 40, reward: 6 },
  {
    enemyType: 'normalBoss',
    count: 3,
    spawnInterval: 900,
    hp: 500,
    reward: 50,
  },
] as const;
