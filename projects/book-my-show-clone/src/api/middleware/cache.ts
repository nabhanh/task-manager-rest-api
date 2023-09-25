// filename: cache.ts
// a middleware function which returns cached response if available

import { Request, Response, NextFunction } from 'express';
import client from '../../lib/redis';

export const checkCache =
  (key: string) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cachedResponse = await client.get(key);
      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }
      next();
    } catch (err) {
      next();
    }
  };
