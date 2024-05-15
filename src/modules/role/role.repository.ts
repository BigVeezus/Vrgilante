import { Model, Document } from 'mongoose';
import { AbstractRepository } from '../../utils/repository/abstract.repository';
import Role, { IRole } from './role.model';

class RoleRepository extends AbstractRepository<IRole> {
  constructor(readonly roleModel: Model<IRole & Document>) {
    super(roleModel);
  }
}

export default new RoleRepository(Role);
