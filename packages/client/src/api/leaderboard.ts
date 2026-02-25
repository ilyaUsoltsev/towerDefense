import { HttpClient } from '../utils/httpClient';
import {
  LeaderboardAddRequest,
  LeaderboardEntry,
  LeaderboardGetRequest,
} from './type';
import type { APIError } from './type';
import {
  LEADERBOARD_ADD,
  LEADERBOARD_ALL,
  LEADERBOARD_RATING_FIELD_NAME,
  LEADERBOARD_TEAM_NAME,
} from '../constants/leaderboard';
import type { LeaderboardEntryData, User } from './type';

function isApiError(r: unknown): r is APIError {
  return typeof r === 'object' && r !== null && 'status' in r;
}

export default class LeaderboardApi {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Преобразует доменную модель пользователя и результат игры в payload для API лидерборда.
   */
  mapUserToEntryData(
    user: User | null,
    score: number,
    isWin: boolean
  ): LeaderboardEntryData {
    return {
      towerDefenseScore: score,
      isWin,
      ...(user?.login && { login: user.login }),
    };
  }

  /**
   * Добавить результат игры в лидерборд.
   * Обновит запись только если новое значение ratingFieldName больше предыдущего.
   * @throws при ошибке API (статус не 2xx)
   */
  async addResult(data: LeaderboardEntryData): Promise<void> {
    const body: LeaderboardAddRequest = {
      data,
      ratingFieldName: LEADERBOARD_RATING_FIELD_NAME,
      teamName: LEADERBOARD_TEAM_NAME,
    };
    const result = await this.httpClient.post<void>(LEADERBOARD_ADD, body);
    if (isApiError(result)) {
      throw new Error(result.reason ?? result.message);
    }
  }

  /**
   * Получить таблицу лидеров (общий лидерборд по всем командам).
   * @throws при ошибке API (статус не 2xx)
   */
  async getLeaderboard(
    cursor: number,
    limit: number
  ): Promise<LeaderboardEntry[]> {
    const body: LeaderboardGetRequest = {
      ratingFieldName: LEADERBOARD_RATING_FIELD_NAME,
      cursor,
      limit,
    };
    const result = await this.httpClient.post<LeaderboardEntry[]>(
      LEADERBOARD_ALL,
      body
    );
    if (isApiError(result)) {
      throw new Error(result.reason ?? result.message);
    }
    return result;
  }
}
