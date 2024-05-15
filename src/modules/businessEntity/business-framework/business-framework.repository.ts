import mongoose, { Model, Document, CreateOptions, Require_id } from 'mongoose';
import { AbstractRepository } from '../../../utils/repository/abstract.repository';
import BusinessFramework, { IBusinessFramework } from './business-framework.model';
import { PaginationDTO } from '../business.interface';
import usersRepository from '../../users/repositories/users.repository';
import { IRole } from '../../role/role.model';
import roleRepository from '../../role/role.repository';
import { IUser } from '../../users/models/users.model';

class BusinessFrameworkRepository extends AbstractRepository<IBusinessFramework> {
  constructor(readonly businessFrameworkModel: Model<IBusinessFramework & Document>) {
    super(businessFrameworkModel);
  }

  async getBusinessUsers(conditions: any, options: PaginationDTO) {
    return await usersRepository.getBusinessUsers(conditions, options);
  }

  async getUserNonPaginated(conditions: any) {
    if (conditions.businessId) new mongoose.Types.ObjectId(conditions.businessId);
    return await usersRepository.find(conditions, { _id: 1, firstName: 1 });
  }

  async findUser(conditions: any) {
    return await usersRepository.findOne(conditions);
  }

  async createRole(data: Partial<Omit<Require_id<IRole>, '_id'>>, options?: CreateOptions) {
    return await roleRepository.create(data, options);
  }

  async createUser(data: Partial<Omit<Require_id<IUser>, '_id'>>, options?: CreateOptions) {
    return await usersRepository.create(data, options);
  }

  async getRole(condition: any) {
    return await roleRepository.findOne(condition);
  }
}
export default new BusinessFrameworkRepository(BusinessFramework);
