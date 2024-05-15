import { AbstractRepository } from '../../utils/repository/abstract.repository';
import Documents, { IDocument } from './document.model';
import { Model, Document } from 'mongoose';
import usersRepository from '../../modules/users/repositories/users.repository';

class DocumentRepository extends AbstractRepository<IDocument> {
  constructor(readonly documentModel: Model<IDocument & Document>) {
    super(documentModel);
  }

  async fetchUser(condition: any) {
    return await usersRepository.findOne(condition);
  }
}

export default new DocumentRepository(Documents);
