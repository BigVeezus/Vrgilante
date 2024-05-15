import mongoose, { Model, Document, CreateOptions, Require_id } from 'mongoose';
import { AbstractRepository } from '../../utils/repository/abstract.repository';
import Framework, { IFramework } from './framework.model';
import { PaginationDTO } from 'modules/businessEntity/business.interface';
import usersRepository from '../users/repositories/users.repository';
import { IRole } from '../../modules/role/role.model';
import roleRepository from '../../modules/role/role.repository';
import { IUser } from '../../modules/users/models/users.model';
import requirementRepository from '../../modules/requirement/requirement.repository';

class FrameworkRepository extends AbstractRepository<IFramework> {
  constructor(readonly frameworkModel: Model<IFramework & Document>) {
    super(frameworkModel);
  }

  async findUser(conditions: any) {
    return await usersRepository.findOne(conditions);
  }

  async getRole(condition: any) {
    return await roleRepository.findOne(condition);
  }

  async getRequirment(condition: any) {
    return await requirementRepository.find(condition);
  }
}
export default new FrameworkRepository(Framework);
