import Joi from 'joi';

export const createTaskValidation = Joi.object().keys({
  businessId: Joi.string().required(),
  title: Joi.string().required(),
  user: Joi.object().required(),
  description: Joi.string().required(),
  assignedTo: Joi.string().required(),
  dueDate: Joi.date().iso().required(),
  reminder: Joi.date().iso().optional().allow(''),
  status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending'),
  priority: Joi.string().valid('low', 'medium', 'high').required(),
  //tags: Joi.array().items(Joi.string().trim().optional()).optional().default(null),
  attachments: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().trim().uri().optional().default(null),
        description: Joi.string().trim().optional().default(null),
      }),
    )
    .optional()
    .allow(''),
});

export const addCommentToTaskValidation = Joi.object().keys({
  userId: Joi.string().required(),
  text: Joi.string().required(),
});

export const assignTaskToUserValidation = Joi.object().keys({
  taskId: Joi.string().required(),
  userId: Joi.string().required(),
});

export const updateTaskValidation = Joi.object().keys({
  businessId: Joi.string().optional(),
  taskId: Joi.string().required(),
  user: Joi.object().required(),
  title: Joi.string().optional(),
  description: Joi.string().required(),
  assignedTo: Joi.string().optional(),
  dueDate: Joi.date().iso().optional(),
  reminder: Joi.date().iso().optional().allow(''),
  status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending'),
  priority: Joi.string().valid('low', 'medium', 'high').default('low'),
  tags: Joi.array().items(Joi.string().trim().optional()).optional().allow(''),
  attachments: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().trim().uri().optional().default(null),
        description: Joi.string().trim().optional().default(null),
      }),
    )
    .optional()
    .allow(''),
});

export const getTaskValidation = Joi.object().keys({
  businessId: Joi.string().required(),
  taskId: Joi.string().required(),
});

export const deleteTaskValidation = Joi.object().keys({
  businessId: Joi.string().required(),
  taskId: Joi.string().required(),
  user: Joi.object().required(),
});

export const getTasksValidation = Joi.object().keys({
  businessId: Joi.string().required(),
  status: Joi.string().trim().optional(),
  priority: Joi.string().trim().optional(),
  title: Joi.string().trim().optional(),
  page: Joi.number().optional().default(1),
  limit: Joi.number().optional().default(20),
  shouldBePaginated: Joi.boolean().optional().default(true),
});

export const updateTaskStatusValidation = Joi.object().keys({
  businessId: Joi.string().required(),
  taskId: Joi.string().required(),
  user: Joi.object().required(),
  status: Joi.string().valid('pending', 'in-progress', 'completed').required(),
});
