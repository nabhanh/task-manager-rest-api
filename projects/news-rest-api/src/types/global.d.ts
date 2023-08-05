import { User } from './types';

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      JWT_SECRET?: string;
      API_KEY?: string;
      SALT_ROUNDS?: string;
    }
  }
  namespace Express {
    export interface Request {
      user?: User | null;
    }
  }
}

export {};
