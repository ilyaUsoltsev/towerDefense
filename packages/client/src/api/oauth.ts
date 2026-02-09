import { HttpClient } from '../utils/httpClient';
import { APIError, OauthServiceIdResponse } from './type';

export default class OauthApi {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getServiceId(
    redirectUri: string
  ): Promise<OauthServiceIdResponse | APIError> {
    return this.httpClient.get<OauthServiceIdResponse>(
      `/oauth/yandex/service-id?redirect_uri=${encodeURIComponent(redirectUri)}`
    );
  }

  async signIn(code: string, redirectUri: string): Promise<void | APIError> {
    return this.httpClient.post<void>('/oauth/yandex', {
      code,
      redirect_uri: redirectUri,
    });
  }
}
