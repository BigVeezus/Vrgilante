import mongoose, { Model, Document, CreateOptions, Require_id } from 'mongoose';
import { AbstractRepository } from '../../../utils/repository/abstract.repository';
import DocumentHistory, { IDocumentHistory } from './document-history.model';
import usersRepository from '../../users/repositories/users.repository';
import { IRole } from '../../role/role.model';
import roleRepository from '../../role/role.repository';
import { IUser } from '../../users/models/users.model';

class DocumentHistoryRepository extends AbstractRepository<IDocumentHistory> {
  constructor(readonly documentHistoryModel: Model<IDocumentHistory & Document>) {
    super(documentHistoryModel);
  }
}
export default new DocumentHistoryRepository(DocumentHistory);
