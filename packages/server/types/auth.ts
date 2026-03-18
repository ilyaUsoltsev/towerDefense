import type { Request } from 'express';

export interface UserData {
  id: number;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  avatar: string;
  phone: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: UserData;
}
