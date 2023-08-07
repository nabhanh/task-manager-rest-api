import express, {
  NextFunction,
  Request,
  Response,
  json,
  urlencoded
} from 'express';
import tasksRouter from './routes/tasks';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.use('/tasks', tasksRouter);

app.all('*', (_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
