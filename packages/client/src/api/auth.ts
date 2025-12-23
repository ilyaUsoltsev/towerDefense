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

  constructor() {
    this.httpClient = new HttpClient({
      baseUrl: 'https://ya-praktikum.tech/api/v2/auth',
    });
  }

  async create(data: CreateUser): Promise<SignUpResponse | APIError> {
    return this.httpClient.post<SignUpResponse>('/signup', data);
  }

  async login(data: LoginRequestData): Promise<void | APIError> {
    return this.httpClient.post<void>('/signin', data);
  }

  async me(): Promise<User | APIError> {
    return this.httpClient.get<User>('/user');
  }

  async logout(): Promise<void | APIError> {
    return this.httpClient.post<void>('/logout');
  }
}
