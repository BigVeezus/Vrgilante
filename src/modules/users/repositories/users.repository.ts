import { Document, Model } from 'mongoose';
import { AbstractRepository } from '../../../utils/repository/abstract.repository';
import User, { IUser } from '../models/users.model';
import { PaginationDTO } from '../../businessEntity/business.interface';
import bcrypt from 'bcrypt';

class UserRepository extends AbstractRepository<IUser> {
  constructor(readonly userModel: Model<IUser & Document>) {
    super(userModel);
  }

  async getBusinessUsers(conditions: any, options: PaginationDTO) {
    const { limit = 20, page = 1, sort } = options;
    const [data, total] = await Promise.all([
      this.schemaModel.aggregate([
        {
          $match: conditions,
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'roleId',
            foreignField: '_id',
            as: 'role',
          },
        },
        {
          $unwind: { path: '$role' },
        },
        {
          $sort: sort,
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        },
      ]),
      this.count(conditions),
    ]);
    const meta = this.getMeta({ total, data, limit, page });
    return { data, meta };
  }

  async userProfileData(condition: any) {
    const user = await this.schemaModel.aggregate([
      {
        $match: condition,
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'roleId',
          foreignField: '_id',
          as: 'role',
        },
      },
      {
        $unwind: { path: '$role' },
      },
      {
        $lookup: {
          from: 'businesses',
          localField: 'businessId',
          foreignField: '_id',
          as: 'business',
        },
      },
      {
        $unwind: { path: '$business' },
      },
    ]);
    return user[0];
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);
    return passwordHashed;
  }
}

export default new UserRepository(User);
