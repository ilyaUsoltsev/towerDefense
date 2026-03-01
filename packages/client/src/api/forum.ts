import { HttpClient } from '../utils/httpClient';
import type { APIError } from './type';
import { SERVER_HOST } from '../constants';

const FORUM_API_BASE = (SERVER_HOST || 'http://localhost:3001') + '/api';

const forumClient = new HttpClient({ baseUrl: FORUM_API_BASE });

export type TopicApi = {
  id: number;
  title: string;
  content: string;
  userid: number;
  createdAt: string;
  updatedAt: string;
};

export type TopicsResponse = {
  topics: TopicApi[];
  total: number;
  page: number;
  limit: number;
};

export type CommentApi = {
  id: number;
  content: string;
  userid: number;
  topicid: number;
  author_login: string | null;
  createdAt: string;
  updatedAt: string;
};

export const forumApi = {
  getTopics(): Promise<TopicsResponse | APIError> {
    return forumClient.get<TopicsResponse>('/topics?page=1&limit=50');
  },

  getTopic(id: number): Promise<TopicApi | APIError> {
    return forumClient.get<TopicApi>(`/topics/${id}`);
  },

  createTopic(data: {
    title: string;
    content: string;
  }): Promise<TopicApi | APIError> {
    return forumClient.post<TopicApi>('/topics', data);
  },

  getComments(topicId: number): Promise<CommentApi[] | APIError> {
    return forumClient.get<CommentApi[]>(`/topics/${topicId}/comments`);
  },

  createComment(
    topicId: number,
    content: string
  ): Promise<CommentApi | APIError> {
    return forumClient.post<CommentApi>(`/topics/${topicId}/comments`, {
      content,
    });
  },
};
