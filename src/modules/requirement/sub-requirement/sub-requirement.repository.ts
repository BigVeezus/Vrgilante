import mongoose, { Model, Document, CreateOptions, Require_id } from 'mongoose';
import { AbstractRepository } from '../../../utils/repository/abstract.repository';
import SubRequirement, { ISubRequirement } from './sub-requirement.model';
import { PaginationDTO } from 'modules/businessEntity/business.interface';
import usersRepository from '../../users/repositories/users.repository';
import { IRole } from '../../../modules/role/role.model';
import roleRepository from '../../../modules/role/role.repository';
import { IUser } from '../../../modules/users/models/users.model';

class SubRequirementRepository extends AbstractRepository<ISubRequirement> {
  constructor(readonly subRequirementModel: Model<ISubRequirement & Document>) {
    super(subRequirementModel);
  }

  async findUser(conditions: any) {
    return await usersRepository.findOne(conditions);
  }

  async getRole(condition: any) {
    return await roleRepository.findOne(condition);
  }
}
export default new SubRequirementRepository(SubRequirement);
