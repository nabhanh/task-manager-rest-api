import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import authRouter from './api/routes/auth';
import newsRouter from './api/routes/news';
import preferenceRouter from './api/routes/preference';
import logger from './lib/logger';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/auth', authRouter);
app.use('/news', newsRouter);
app.use('/preferences', preferenceRouter);

app.all('*', (req, res) => {
  console.log(req.url, req.method);
  res.status(404).json({ message: 'Not found' });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack);
  res.status(500).json({ message: err.message });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});