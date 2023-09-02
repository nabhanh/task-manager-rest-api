import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import authRouter from './api/routes/auth';
import newsRouter from './api/routes/news';
import preferenceRouter from './api/routes/preference';
import httpLogger, { logger } from './lib/logger';
import rateLimiter from 'express-rate-limit';

const app = express();

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(
  '/auth',
  rateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 20 // limit each IP to 10 requests per hour for an IP
  }),
  authRouter
);
app.use('/news', newsRouter);
app.use('/preferences', preferenceRouter);

app.all('*', (req, res) => {
  logger.info(req.url);
  res.status(404).json({ message: 'Not found' });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({ message: err.message });
});

export default app;
