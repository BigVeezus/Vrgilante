import { IUser } from 'modules/users/models/users.model';
import { PaginationDTO } from '../../modules/businessEntity/business.interface';

export interface CreateTaskDTO {
  businessId: string;
  user: IUser;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  reminder?: Date;
  status: string;
  priority: string;
  //tags?: string[];
  attachments?: [
    {
      url: string;
      description: string;
    },
  ];
}

export interface UpdateTaskDTO {
  businessId: string;
  user: IUser;
  taskId: string;
  title?: string;
  description?: string;
  assignedTo?: string;
  dueDate?: Date;
  reminder?: Date;
  status?: string;
  priority?: string;
  tags?: string[];
  attachments?: [
    {
      url?: string;
      description?: string;
    },
  ];
}

export interface UpdateTaskStatusDTO {
  businessId: string;
  taskId: string;
  user: IUser;
  status: string;
}

export interface AddCommentToTaskDTO {
  userId: string;
  text: string;
}

export interface AssignTaskToUserDTO {
  taskId: string;
  user: IUser;
  businessId: string;
}

export interface GetTaskDTO {
  taskId: string;
  businessId: string;
}

export interface DeleteTaskDTO {
  taskId: string;
  businessId: string;
  user: IUser;
}

export interface getTasksDTO extends PaginationDTO {
  businessId: string;
  status?: string;
  priority?: string;
  title?: string;
}
