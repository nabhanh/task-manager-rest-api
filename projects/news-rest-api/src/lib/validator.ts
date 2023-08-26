import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

const validator =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });

      return next();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return res.status(400).send(err.errors);
    }
  };

export default validator;
