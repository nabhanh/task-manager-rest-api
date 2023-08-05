import express, { NextFunction, Request, Response } from 'express';
import pino from 'pino-http';
import authRouter from './api/routes/auth';
import newsRouter from './api/routes/news';
const app = express();

app.use(pino());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/auth', authRouter);
app.use('/news', newsRouter);

app.all('*', (req, res) => {
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
