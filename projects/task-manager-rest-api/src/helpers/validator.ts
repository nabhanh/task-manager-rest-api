import Joi from 'joi';
import { TaskPriority } from '../constants';
import { NextFunction, Request, Response } from 'express';

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string()
    .valid(...Object.values(TaskPriority))
    .required(),
  isCompleted: Joi.boolean().required()
});

export const validateTask = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = taskSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  next();
};
