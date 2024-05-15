import { AssignTaskToUserDTO, CreateTaskDTO, DeleteTaskDTO, GetTaskDTO, UpdateTaskDTO, UpdateTaskStatusDTO, getTasksDTO } from './task.interface';
import { validate } from '../../utils';
import { assignTaskToUserValidation, createTaskValidation, deleteTaskValidation, getTaskValidation, getTasksValidation, updateTaskStatusValidation, updateTaskValidation } from './task.validation';
import * as taskService from './task.service';

export const createNewTask = async (params: CreateTaskDTO) => {
  const value = validate(params, createTaskValidation);
  const data = await taskService.createTask(value);
  return {
    data,
    message: 'Task created successfully!',
  };
};

export const getTask = async (params: GetTaskDTO) => {
  const value = validate(params, getTaskValidation);
  const data = await taskService.getTask(value);
  return {
    data,
    message: 'Task retrieved successfully!',
  };
};

export const getTasks = async (params: getTasksDTO) => {
  const value = validate(params, getTasksValidation);
  const data = await taskService.getTasks(value);
  console.log('data', data);
  return {
    data,
    message: 'Tasks retrieved successfully!',
  };
};

export const taskUpdate = async (params: UpdateTaskDTO) => {
  const value = validate(params, updateTaskValidation);
  const data = await taskService.updateTask(value);
  return {
    data,
    message: 'Task updated successfully!',
  };
};

export const deleteTask = async (params: DeleteTaskDTO) => {
  const value = validate(params, deleteTaskValidation);
  const data = await taskService.removeTask(value);
  return {
    data,
    message: 'Task deleted successfully',
  };
};

export const assignTask = async (params: AssignTaskToUserDTO) => {
  const value = validate(params, assignTaskToUserValidation);
  const data = await taskService.assignTaskUser(value);
  return {
    data,
    message: 'Task assigned successfully',
  };
};

export const updateStatus = async (params: UpdateTaskStatusDTO) => {
  const value = validate(params, updateTaskStatusValidation);
  const data = await taskService.updateTaskStatus(value);
  return {
    data,
    message: 'Task status updated successfully',
  };
};
