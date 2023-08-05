// auth middleware to check if the request is authenticated using the token

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import users from '../../users.json';
import { UserWithPreferences } from '../../schemas/user';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token!, process.env.JWT_SECRET!);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = users.find(user => user.id === (decoded as any).id);
    if (!user) {
      throw new Error();
    }
    req.user = user as UserWithPreferences;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized to access this resource' });
  }
};
