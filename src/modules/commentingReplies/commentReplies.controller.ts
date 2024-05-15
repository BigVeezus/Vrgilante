import { validate } from '../../utils';
import { CreateCommentDTO, CreateReply, GetCommentsDTO, GetRepliesDTO, GetTaskCommentDTO } from './commentingReplies.interface';
import * as commentReplyServices from './commentingReplies.service';
import { createCommentValidation, createReplyValidation, getCommentsValidation, getRepliesValidation } from './commentingReplies.validation';

export const createComment = async (params: CreateCommentDTO) => {
  const value = validate(params, createCommentValidation);
  const data = await commentReplyServices.createComment(value);
  return {
    data,
    message: 'Comment created successfully',
  };
};

export const getComments = async (params: GetCommentsDTO) => {
  const value = validate(params, getCommentsValidation);
  const data = await commentReplyServices.getComments(value);
  return {
    data,
    message: 'Comment retrieved',
  };
};

export const getCommentsByTask = async (params: GetTaskCommentDTO) => {
  // const value = validate(params, getCommentsValidation);
  const data = await commentReplyServices.getCommentsByTask(params);
  return {
    data,
    message: 'Comment retrieved',
  };
};

export const createReply = async (params: CreateReply) => {
  const value = validate(params, createReplyValidation);
  const data = await commentReplyServices.createReply(value);
  return {
    data,
    message: 'Reply created successfully',
  };
};

export const getReplies = async (params: GetRepliesDTO) => {
  const value = validate(params, getRepliesValidation);
  const data = await commentReplyServices.getReplies(value);
  return {
    data,
    message: 'Replies retrieved',
  };
};
