/**
 * Конфигурация различных типов врагов в игре
 * Здоровье и награда определяются в зависимости от волны и определены в wave-config.ts
 */
export const EnemiesConfig = {
  normal: {
    speed: 1,
    description: 'Простой враг с низким здоровьем и скоростью',
    immune: false,
    radius: 11,
    imageRoot: '/soldier/blue.png',
  },
  humanoidBoss: {
    speed: 1,
    description: 'Босс с высоким здоровьем и низкой скоростью',
    immune: false,
    radius: 12,
    imageRoot: '/boss/humanoid.png',
  },
  golemBoss: {
    speed: 1,
    description: 'Босс с высоким здоровьем и очень низкой скоростью',
    immune: false,
    radius: 17,
    imageRoot: '/boss/golem.png',
  },
  skeletonBoss: {
    speed: 1,
    description:
      'Босс с высоким здоровьем и низкой скоростью, устойчивый к замедлению',
    immune: true,
    radius: 12,
    imageRoot: '/boss/skeleton.png',
  },
  fast: {
    speed: 1.5,
    description: 'Быстрый враг с низким здоровьем',
    immune: false,
    radius: 10,
    imageRoot: '/soldier/black.png',
  },
  immune: {
    speed: 1,
    description: 'Враг с высоким здоровьем, устойчивый к замедлению',
    immune: true,
    radius: 14,
    imageRoot: '/soldier/purple.png',
  },
} as const;

export type EnemyType = keyof typeof EnemiesConfig;
