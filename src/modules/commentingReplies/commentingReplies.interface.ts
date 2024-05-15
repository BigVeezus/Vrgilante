import { IUser } from 'modules/users/models/users.model';
import mongoose from 'mongoose';

export interface CreateCommentDTO {
  user: IUser;
  businessId: string;
  text: string;
  entity: string;
  taskId?: mongoose.Types.ObjectId;
}

export interface UpdateCommentDTO {
  user: IUser;
  commentId: string;
  text: string;
  taskId?: mongoose.Types.ObjectId;
}

export interface RemoveCommentDTO {
  user: IUser;
  commentId: string;
}

export interface CreateReply {
  user: IUser;
  text: string;
  commentId: string;
}

export interface GetRepliesDTO {
  commentId: string;
}

export interface GetCommentsDTO {
  businessId: string;
  entity: string;
}

export interface GetTaskCommentDTO {
  taskId: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
}
