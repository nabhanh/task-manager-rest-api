import Joi from 'joi';
import { Priority } from '../constants.js';

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string()
    .valid(...Object.values(Priority))
    .required(),
  isCompleted: Joi.boolean().required()
});

export const validateTask = (req, res, next) => {
  const { error } = taskSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  next();
};
