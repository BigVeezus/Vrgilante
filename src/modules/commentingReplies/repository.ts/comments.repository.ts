import { Model, Document } from 'mongoose';
import { AbstractRepository } from '../../../utils/repository/abstract.repository';
import Comment, { IComments } from '../model.ts/comments.model';

class CommentRepository extends AbstractRepository<IComments> {
  constructor(readonly commentModel: Model<IComments & Document>) {
    super(commentModel);
  }
}

export default new CommentRepository(Comment);
