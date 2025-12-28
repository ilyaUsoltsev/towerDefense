export const wavesConfig = [
  {
    enemyType: 'normal',
    name: 'Normal',
    count: 5,
    spawnInterval: 500,
    hp: 20,
    reward: 5,
  },
  {
    enemyType: 'fast',
    name: 'Fast',
    count: 5,
    spawnInterval: 300,
    hp: 30,
    reward: 7,
  },
  {
    enemyType: 'immune',
    name: 'Immune',
    count: 5,
    spawnInterval: 500,
    hp: 40,
    reward: 6,
  },
  {
    enemyType: 'normalBoss',
    name: 'Boss',
    count: 3,
    spawnInterval: 900,
    hp: 100,
    reward: 50,
  },
] as const;
