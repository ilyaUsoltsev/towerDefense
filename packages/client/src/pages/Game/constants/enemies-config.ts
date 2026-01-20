/**
 * Конфигурация различных типов врагов в игре
 * Здоровье и награда определяются в зависимости от волны и определены в wave-config.ts
 */
export const EnemiesConfig = {
  normal: {
    speed: 1,
    description: 'Простой враг с низким здоровьем и скоростью',
    immune: false,
    radius: 10,
    color: 'pink',
  },
  normalBoss: {
    speed: 1,
    description: 'Босс с высоким здоровьем и низкой скоростью',
    immune: false,
    radius: 10,
    color: 'red',
  },
  fast: {
    speed: 1.5,
    description: 'Быстрый враг с низким здоровьем',
    immune: false,
    radius: 8,
    color: 'lightblue',
  },
  immune: {
    speed: 1,
    description: 'Враг с высоким здоровьем, устойчивый к замедлению',
    immune: true,
    radius: 12,
    color: 'lightgreen',
  },
} as const;

export type EnemyType = keyof typeof EnemiesConfig;
