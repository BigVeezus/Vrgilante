import mongoose, { Model, Document, CreateOptions, Require_id, ObjectId } from 'mongoose';
import { AbstractRepository } from '../../utils/repository/abstract.repository';
import Business, { IBusiness } from './business.model';
import { PaginationDTO } from './business.interface';
import usersRepository from '../users/repositories/users.repository';
import { IRole } from '../../modules/role/role.model';
import roleRepository from '../../modules/role/role.repository';
import { IUser } from '../../modules/users/models/users.model';
import documentRepository from '../../modules/document/document.repository';

class BusinessRepository extends AbstractRepository<IBusiness> {
  constructor(readonly businessModel: Model<IBusiness & Document>) {
    super(businessModel);
  }

  async getBusinessUsers(conditions: any, options: PaginationDTO) {
    return await usersRepository.getBusinessUsers(conditions, options);
  }

  async getUserNonPaginated(conditions: any) {
    if (conditions.businessId) new mongoose.Types.ObjectId(conditions.businessId);
    return await usersRepository.find(conditions, {}, { _id: 1, firstName: 1 });
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

  async getDocument(businessId: string) {
    return await documentRepository.count({ businessId: new mongoose.Types.ObjectId(businessId) });
  }
}
export default new BusinessRepository(Business);
