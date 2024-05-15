import mongoose, { Model, Document, CreateOptions, Require_id } from 'mongoose';
import { AbstractRepository } from '../../utils/repository/abstract.repository';
import Evidence, { IEvidence } from './evidence.model';
import usersRepository from '../users/repositories/users.repository';
import { IRole } from '../role/role.model';
import roleRepository from '../role/role.repository';
import { IUser } from '../users/models/users.model';

class EvidenceRepository extends AbstractRepository<IEvidence> {
  constructor(readonly evidenceModel: Model<IEvidence & Document>) {
    super(evidenceModel);
  }
}
export default new EvidenceRepository(Evidence);
