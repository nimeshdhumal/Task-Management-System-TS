import Joi from "joi";

const createTasksSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    status: Joi.string().valid('todo', 'in-progress', 'done'),
    priority: Joi.string().valid('low', 'medium', 'high'),
    dueDate: Joi.date().optional()
});

export default createTasksSchema;