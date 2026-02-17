export const GameConfig = {
  waveDelay: 10000,
  hp: 10,
  initialMoney: 80,
  tileSize: 32,
  maxCannonLevel: 5,
  lowHpThreshold: 3,
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
  gameStartDelay: 5,
  sound: {
    click: {
      src: 'click',
      vol: 1,
    },
    bgMusic: {
      src: 'backgroundMusic',
      vol: 0.2,
    },
    loss: {
      src: 'lose',
      vol: 1,
    },
    win: {
      src: 'win',
      vol: 1,
    },
    upgrade: {
      src: 'upgrade',
      vol: 1,
    },
    placeCannon: {
      src: 'placeCannon',
      vol: 0.3,
    },
    enemySpawn: {
      src: 'enemySpawn',
      vol: 1,
    },
    enemyDespawn: {
      src: 'enemyDespawn',
      vol: 1,
    },
    enemyDeath: {
      src: 'enemyDeath',
      vol: 1,
    },
  },
} as const;
