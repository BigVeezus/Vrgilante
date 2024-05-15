import mongoose, { Model, Document, CreateOptions, Require_id } from 'mongoose';
import { AbstractRepository } from '../../../utils/repository/abstract.repository';
import EvidenceHistory, { IEvidenceHistory } from './evidence-history.model';
import usersRepository from '../../users/repositories/users.repository';
import { IRole } from '../../role/role.model';
import roleRepository from '../../role/role.repository';
import { IUser } from '../../users/models/users.model';

class EvidenceHistoryRepository extends AbstractRepository<IEvidenceHistory> {
  constructor(readonly evidenceHistoryModel: Model<IEvidenceHistory & Document>) {
    super(evidenceHistoryModel);
  }
}
export default new EvidenceHistoryRepository(EvidenceHistory);
