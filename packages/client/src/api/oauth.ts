import { HttpClient } from '../utils/httpClient';
import { APIError, OauthServiceIdResponse } from './type';

export default class OauthApi {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient({
      baseUrl: 'https://ya-praktikum.tech/api/v2/oauth',
    });
  }

  async getServiceId(
    redirectUri: string
  ): Promise<OauthServiceIdResponse | APIError> {
    return this.httpClient.get<OauthServiceIdResponse>(
      `/yandex/service-id?redirect_uri=${encodeURIComponent(redirectUri)}`
    );
  }

  async signIn(code: string, redirectUri: string): Promise<void | APIError> {
    return this.httpClient.post<void>('/yandex', {
      code,
      redirect_uri: redirectUri,
    });
  }
}
