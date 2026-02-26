import { HttpClient } from '../utils/httpClient';

const API_BASE_URL = 'https://ya-praktikum.tech/api/v2';

export const httpClient = new HttpClient({ baseUrl: API_BASE_URL });
