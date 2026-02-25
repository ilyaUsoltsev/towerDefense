// Используется в запросах к API лидерборда (отправка результата и получение топа).
export const LEADERBOARD_RATING_FIELD_NAME = 'towerDefenseScore' as const;

// По teamName бекенд разделяет рекорды разных игр.
export const LEADERBOARD_TEAM_NAME = 'towerDefense' as const;

/** Пути API лидерборда. */
export const LEADERBOARD_ADD = '/leaderboard' as const;
export const LEADERBOARD_ALL = '/leaderboard/all' as const;
