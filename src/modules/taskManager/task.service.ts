import mongoose from 'mongoose';
import { BadRequestException, UnprocessableEntityError } from '../../utils';
import { AssignTaskToUserDTO, CreateTaskDTO, DeleteTaskDTO, GetTaskDTO, UpdateTaskDTO, UpdateTaskStatusDTO, getTasksDTO } from './task.interface';
import taskRepository from './task.repository';
import { ITask } from './task.model';

export const createTask = async (params: CreateTaskDTO) => {
  const assignedUser = await taskRepository.getAssignee(params.businessId, params.assignedTo);
  if (!assignedUser) throw new BadRequestException({ message: 'Assignee is not part of your organisation' });

  const currentDate = new Date();
  if (new Date(params.dueDate) <= currentDate) {
    throw new UnprocessableEntityError({ message: 'Due date cannot be less than or equal the current date' });
  }

  if (params.reminder && new Date(params.reminder) <= currentDate) {
    throw new UnprocessableEntityError({ message: 'Reminder cannot be less than or equal the current date' });
  }
  const task = await taskRepository.create({
    businessId: assignedUser.businessId,
    ownerId: params.user._id,
    title: params.title,
    //tags: params.tags,
    description: params.description,
    assignedTo: assignedUser._id,
    dueDate: params.dueDate,
    reminder: params.reminder,
    status: params.status,
    priority: params.priority,
    attachments: params.attachments,
  });
  return task;
};

export const getTask = async (params: GetTaskDTO) => {
  const condition = {
    _id: new mongoose.Types.ObjectId(params.taskId),
    businessId: new mongoose.Types.ObjectId(params.businessId),
  };
  const task = await taskRepository.getTask(condition);
  if (!task) throw new UnprocessableEntityError({ message: 'Task not found' });
  return task;
};

export const getTasks = async (params: getTasksDTO) => {
  if (!params.shouldBePaginated) return await getTasksNoPagination(params.businessId);
  const searchCondition = getTaskSearchData(params);
  const task = await taskRepository.getTasks(searchCondition, {
    limit: params.limit,
    page: params.page,
    sort: { createdAt: -1 },
    businessId: params.businessId,
  });
  console.log('task', task);
  return {
    tasks: task.data,
    pagination: task.meta,
  };
};

export const updateTask = async (params: UpdateTaskDTO) => {
  const task = await taskRepository.findOne({
    _id: new mongoose.Types.ObjectId(params.taskId),
    businessId: new mongoose.Types.ObjectId(params.businessId),
  });
  if (!task) throw new BadRequestException({ message: 'Task not found' });
  if (task.assignedTo.toString() !== params.user._id.toString() && task.ownerId.toString() !== params.user._id.toString()) throw new BadRequestException({ message: 'Action cannot be performed' });

  const currentDate = new Date();
  if (params.dueDate && new Date(params.dueDate) <= currentDate) {
    throw new UnprocessableEntityError({ message: 'Due date cannot be less than or equal the current date' });
  }
  const taskData = getUpdateTaskData(params, task);
  const updateTask = await taskRepository.update(params.taskId, taskData);
  return updateTask;
};

export const removeTask = async (params: DeleteTaskDTO) => {
  const task = await taskRepository.findOne({
    _id: new mongoose.Types.ObjectId(params.taskId),
    businessId: new mongoose.Types.ObjectId(params.businessId),
  });
  if (!task) throw new BadRequestException({ message: 'Task not found' });
  await taskRepository.delete(params.taskId);
  return;
};

export const assignTaskUser = async (params: AssignTaskToUserDTO) => {
  const task = await taskRepository.findOne({
    _id: new mongoose.Types.ObjectId(params.taskId),
    businessId: new mongoose.Types.ObjectId(params.businessId),
  });
  if (!task) throw new BadRequestException({ message: 'Task not found' });

  const user = await taskRepository.getAssignee(params.businessId, params.user._id.toString());
  if (!user) throw new BadRequestException({ message: 'User not found' });

  const assigneUserToTask = await taskRepository.update(params.taskId, {
    assignedTo: user._id,
  });
  return assigneUserToTask;
};

export const updateTaskStatus = async (params: UpdateTaskStatusDTO) => {
  let task = await taskRepository.findOne({
    _id: new mongoose.Types.ObjectId(params.taskId),
    businessId: new mongoose.Types.ObjectId(params.businessId),
  });
  if (!task) throw new BadRequestException({ message: 'Task not found' });
  if (task.assignedTo.toString() !== params.user._id.toString() && task.ownerId.toString() !== params.user._id.toString()) throw new BadRequestException({ message: 'Action cannot be performed' });
  if (task.status == params.status) throw new BadRequestException({ message: `Task currently in ${params.status}` });
  task = await taskRepository.update(params.taskId, {
    status: params.status,
  });

  return task;
};

const getTasksNoPagination = async (businessId: string) => {
  console.log('here');
  return await taskRepository.find({ businessId: new mongoose.Types.ObjectId(businessId) }, { title: 1, description: 1, status: 1, priority: 1 });
};

const getTaskSearchData = (params: getTasksDTO) => {
  let criteria: any = {
    businessId: new mongoose.Types.ObjectId(params.businessId),
  };

  if (params.status) {
    const status = params.status.split(',');
    criteria = {
      ...criteria,
      status: { $in: status },
    };
  }

  if (params.priority) {
    const priority = params.priority.split(',');
    criteria = {
      ...criteria,
      priority: { $in: priority },
    };
  }

  if (params.title) {
    const title = new RegExp(params.title, 'i');
    criteria = {
      ...criteria,
      title: { $regex: title },
    };
  }

  return criteria;
};

const getUpdateTaskData = (params: UpdateTaskDTO, task: ITask) => {
  return {
    status: params.status || task.status,
    priority: params.priority || task.priority,
    tags: params.tags || task.tags,
    title: params.title || task.title,
    description: params.description || task.description,
    reminder: params.reminder || task.reminder,
    attachments: params.attachments || task.attachments,
    dueDate: params.dueDate || task.dueDate,
  };
};
