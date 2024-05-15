import { AbstractRepository } from '../../../utils/repository/abstract.repository';
import Reply, { IReply } from '../model.ts/reply.model';
import { Model, Document } from 'mongoose';

class ReplyRepository extends AbstractRepository<IReply> {
  constructor(readonly replyModel: Model<IReply & Document>) {
    super(replyModel);
  }
}

export default new ReplyRepository(Reply);
