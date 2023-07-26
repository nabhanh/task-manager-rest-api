import express, { json, urlencoded } from 'express';
import tasksRouter from './routes/tasks.js';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/tasks', tasksRouter);

app.all('*', (req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ message: err.message });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
