import type { APIError } from '../api/type'; // укажите корректный путь к вашему типу APIError

export interface HttpClientConfig {
  baseUrl: string;
}

export class HttpClient {
  constructor(private config: HttpClientConfig) {}

  /**
   * Универсальный метод для выполнения HTTP-запросов
   * @param method HTTP-метод (GET, POST, PUT, DELETE)
   * @param path Путь к эндпоинту (без базового URL)
   * @param data Данные для отправки в теле запроса
   * @returns Ответ от сервера или объект ошибки
   */
  protected async request<T>(
    method: string,
    path: string,
    data?: unknown
  ): Promise<T | APIError> {
    const url = `${this.config.baseUrl}${path}`;

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };

    if (
      data != null &&
      typeof data !== 'string' &&
      typeof data !== 'number' &&
      typeof data !== 'boolean'
    ) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);

      // Обработка ошибок HTTP (статус не 2xx)
      if (!response.ok) {
        const errorData: APIError = await response.json().catch(() => ({
          status: response.status,
          message: response.statusText,
        }));
        errorData.status = response.status;
        return errorData;
      }

      // Для статуса 204 No Content возвращаем пустой объект
      if (response.status === 204) {
        return {} as T;
      }

      // Успешный ответ - возвращаем JSON
      return await response.json();
    } catch (error) {
      // Сетевые ошибки и прочие исключения
      return {
        status: 500,
        message: 'Network error or server unreachable',
      };
    }
  }

  // Публичные методы-обёртки для стандартных HTTP-методов

  public async get<T>(path: string): Promise<T | APIError> {
    return this.request<T>('GET', path);
  }

  public async post<T>(path: string, data?: unknown): Promise<T | APIError> {
    return this.request<T>('POST', path, data);
  }

  public async put<T>(path: string, data?: unknown): Promise<T | APIError> {
    return this.request<T>('PUT', path, data);
  }

  public async delete<T>(path: string): Promise<T | APIError> {
    return this.request<T>('DELETE', path);
  }
}
