import { Router } from 'express';
import tasks from '../tasks.json';
import { writeFileSync } from 'fs';
import { validateTask } from '../helpers/validator';
import { TaskPriority } from '../constants';

const router = Router();

router.get('/', (req, res) => {
  const {
    search,
    isCompleted,
    sortField,
    sortOrder
  }: {
    search?: string;
    isCompleted?: string;
    sortField?: keyof (typeof tasks)[0];
    sortOrder?: string;
  } = req.query;

  let tasksCopy = [...tasks];

  if (search) {
    tasksCopy = tasksCopy.filter(task =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (isCompleted !== undefined && isCompleted !== null) {
    tasksCopy = tasksCopy.filter(
      task => task.isCompleted === (isCompleted === 'true')
    );
  }

  if (sortField) {
    tasksCopy = tasksCopy.sort((a, b) => {
      if (a[sortField] > b[sortField]) {
        return sortOrder || 'asc' === 'asc' ? 1 : -1;
      }

      if (a[sortField] < b[sortField]) {
        return sortOrder || 'asc' === 'asc' ? -1 : 1;
      }

      return 0;
    });
  }

  res.json(tasksCopy);
});

router.get('/priority/:priority', (req, res) => {
  const { priority } = req.params;

  if (!Object.values(TaskPriority).includes(Number(priority))) {
    return res.status(400).json({ message: 'invalid priority' });
  }

  const tasksByPriority = tasks.filter(
    task => task.priority === Number(priority)
  );

  res.json(tasksByPriority);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  const task = tasks.find(task => task.id === Number(id));

  if (!task) {
    return res.status(404).json({ message: 'task not found' });
  }

  res.json(task);
});

router.post('/', validateTask, (req, res) => {
  const { title, description, priority, isCompleted } = req.body;

  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    priority,
    isCompleted,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.push(newTask);
  writeFileSync('./tasks.json', JSON.stringify(tasks, null, 2));
  res.status(201).json(newTask);
});

router.put('/:id', validateTask, (req, res) => {
  const { id } = req.params;
  const { title, description, priority, isCompleted } = req.body;

  const taskIndex = tasks.findIndex(task => task.id === Number(id));

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'task not found' });
  }

  const updatedTask = {
    id: Number(id),
    title,
    description,
    priority,
    isCompleted,
    createdAt: tasks[taskIndex].createdAt,
    updatedAt: new Date().toISOString()
  };

  tasks[taskIndex] = updatedTask;
  writeFileSync('./tasks.json', JSON.stringify(tasks, null, 2));

  res.json(updatedTask);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(task => task.id === Number(id));

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'task not found' });
  }

  tasks.splice(taskIndex, 1);
  writeFileSync('./tasks.json', JSON.stringify(tasks, null, 2));

  res.sendStatus(204);
});

export default router;
