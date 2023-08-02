

// auth middleware to check if the request is authenticated using the token

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../types/types';
import users from '../../users.json';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token!, process.env.JWT_SECRET!);
        const user = users.find((user: User) => user.id === (decoded as any).id);
        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized to access this resource' });
    }
}