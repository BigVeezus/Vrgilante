import mongoose, { Model, Document, CreateOptions, Require_id } from 'mongoose';
import { AbstractRepository } from '../../../utils/repository/abstract.repository';
import RequirementHistory, { IRequirementHistory } from './requirementHistory.model';
import { PaginationDTO } from 'modules/businessEntity/business.interface';
import usersRepository from '../../users/repositories/users.repository';
import { IRole } from '../../../modules/role/role.model';
import roleRepository from '../../../modules/role/role.repository';
import { IUser } from '../../../modules/users/models/users.model';

class RequirementHistoryRepository extends AbstractRepository<IRequirementHistory> {
  constructor(readonly requirementHistoryModel: Model<IRequirementHistory & Document>) {
    super(requirementHistoryModel);
  }

  async findUser(conditions: any) {
    return await usersRepository.findOne(conditions);
  }

  async getRole(condition: any) {
    return await roleRepository.findOne(condition);
  }
}
export default new RequirementHistoryRepository(RequirementHistory);
