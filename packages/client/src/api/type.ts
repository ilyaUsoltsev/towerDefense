export type APIError = {
  status: number; // Обязательно!
  message: string;
  reason?: string;
};

export type SignUpResponse = {
  id: number;
};

export type User = {
  id: number;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  avatar: string;
  phone: string;
  email: string;
};

export type CreateUser = Omit<User, 'avatar' | 'display_name' | 'id'> & {
  password: string;
};

export type LoginRequestData = {
  login: string;
  password: string;
};

export type OauthServiceIdResponse = {
  service_id: string;
};

/** Данные одной записи лидерборда (контракт с бэкендом). */
export interface LeaderboardEntryData {
  towerDefenseScore: number;
  login?: string;
  display_name?: string;
  isWin?: boolean;
}

export type LeaderboardAddRequest = {
  data: LeaderboardEntryData;
  ratingFieldName: string;
  teamName: string;
};

export type LeaderboardGetRequest = {
  ratingFieldName: string;
  cursor: number;
  limit: number;
};

export type LeaderboardEntry = {
  data: LeaderboardEntryData;
};
