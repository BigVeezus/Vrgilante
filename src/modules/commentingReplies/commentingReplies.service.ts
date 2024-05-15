import mongoose from 'mongoose';
import { CreateCommentDTO, CreateReply, GetCommentsDTO, GetRepliesDTO, GetTaskCommentDTO } from './commentingReplies.interface';
import commentsRepository from './repository.ts/comments.repository';
import replyRepository from './repository.ts/reply.repository';
import { BadRequestException } from '../../utils';

export const createComment = async (params: CreateCommentDTO) => {
  const comment = await commentsRepository.create({
    userId: params.user._id,
    businessId: new mongoose.Types.ObjectId(params.businessId),
    text: params.text,
    entity: params.entity,
    taskId: params.taskId,
  });

  return comment;
};

export const getComments = async (params: GetCommentsDTO) => {
  const comments = await commentsRepository.find({
    businessId: new mongoose.Types.ObjectId(params.businessId),
    entity: params.entity,
  });
  return comments;
};

export const getCommentsByTask = async (params: GetTaskCommentDTO) => {
  // console.log(params);
  const comments = await commentsRepository.find({
    businessId: new mongoose.Types.ObjectId(params.businessId),
    taskId: params.taskId,
  });
  return comments;
};

export const createReply = async (params: CreateReply) => {
  try {
    const session = await replyRepository.schemaModel.startSession();
    session.startTransaction();
    const reply = await replyRepository.create(
      {
        userId: params.user._id,
        commentId: new mongoose.Types.ObjectId(params.commentId),
        text: params.text,
      },
      { session },
    );

    await commentsRepository.update(
      params.commentId,
      {
        $inc: {
          replyCount: 1,
        },
      },
      { session },
    );
    session.commitTransaction();
    return reply;
  } catch (error) {
    throw new BadRequestException({ message: 'Error replying' });
  }
};

export const getReplies = async (params: GetRepliesDTO) => {
  const replies = await replyRepository.find({ commentId: new mongoose.Types.ObjectId(params.commentId) });
  return replies;
};
