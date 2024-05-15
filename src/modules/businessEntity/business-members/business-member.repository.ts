import mongoose, { Model, Document, CreateOptions, Require_id } from 'mongoose';
import { AbstractRepository } from '../../../utils/repository/abstract.repository';
import BusinessTeamMember, { IBusinessTeamMember } from './business-member.model';
import { PaginationDTO } from '../business.interface';
import usersRepository from '../../users/repositories/users.repository';
import { IRole } from '../../../modules/role/role.model';
import roleRepository from '../../../modules/role/role.repository';
import { IUser } from '../../../modules/users/models/users.model';

class BusinessTeamMemberRepository extends AbstractRepository<IBusinessTeamMember> {
  constructor(readonly businessTeamMemberModel: Model<IBusinessTeamMember & Document>) {
    super(businessTeamMemberModel);
  }

  async getBusinessUsers(conditions: any, options: PaginationDTO) {
    return await usersRepository.getBusinessUsers(conditions, options);
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
export default new BusinessTeamMemberRepository(BusinessTeamMember);
