import { HttpClient } from '../utils/httpClient';
import {
  APIError,
  LeaderboardAddRequest,
  LeaderboardEntry,
  LeaderboardGetRequest,
} from './type';
import {
  LEADERBOARD_RATING_FIELD_NAME,
  LEADERBOARD_TEAM_NAME,
} from '../constants/leaderboard';

export default class LeaderboardApi {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Добавить результат игры в лидерборд.
   * Обновит запись только если новое значение ratingFieldName больше предыдущего.
   */
  async addResult(data: Record<string, unknown>): Promise<void | APIError> {
    const body: LeaderboardAddRequest = {
      data,
      ratingFieldName: LEADERBOARD_RATING_FIELD_NAME,
      teamName: LEADERBOARD_TEAM_NAME,
    };
    return this.httpClient.post<void>('/leaderboard', body);
  }

  /**
   * Получить таблицу лидеров (общий лидерборд по всем командам).
   */
  async getLeaderboard(
    cursor: number,
    limit: number
  ): Promise<LeaderboardEntry[] | APIError> {
    const body: LeaderboardGetRequest = {
      ratingFieldName: LEADERBOARD_RATING_FIELD_NAME,
      cursor,
      limit,
    };
    return this.httpClient.post<LeaderboardEntry[]>('/leaderboard/all', body);
  }
}
