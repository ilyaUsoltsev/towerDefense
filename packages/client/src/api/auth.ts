import { HttpClient } from '../utils/httpClient'; // путь к вашему httpClient.ts
import {
  APIError,
  CreateUser,
  LoginRequestData,
  SignUpResponse,
  User,
} from './type';

export default class AuthApi {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async create(data: CreateUser): Promise<SignUpResponse | APIError> {
    return this.httpClient.post<SignUpResponse>('/auth/signup', data);
  }

  async login(data: LoginRequestData): Promise<void | APIError> {
    return this.httpClient.post<void>('/auth/signin', data);
  }

  async me(): Promise<User | APIError> {
    return this.httpClient.get<User>('/auth/user');
  }

  async logout(): Promise<void | APIError> {
    return this.httpClient.post<void>('/auth/logout');
  }
}
