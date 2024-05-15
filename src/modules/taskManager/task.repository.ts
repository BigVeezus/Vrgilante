import mongoose, { Model, Document } from 'mongoose';
import { AbstractRepository } from '../../utils/repository/abstract.repository';
import Task, { ITask } from './task.model';
import usersRepository from '../../modules/users/repositories/users.repository';
import { getTasksDTO } from './task.interface';

class TaskRepository extends AbstractRepository<ITask> {
  constructor(readonly taskModel: Model<ITask & Document>) {
    super(taskModel);
  }

  async getAssignee(businessId: string, assigneeId: string) {
    return await usersRepository.findOne({
      businessId: new mongoose.Types.ObjectId(businessId),
      _id: new mongoose.Types.ObjectId(assigneeId),
      isBlocked: false,
    });
  }

  async getTask(condition: any) {
    const task = await this.schemaModel.aggregate([
      {
        $match: condition,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'assignedUser',
        },
      },
      {
        $unwind: { path: '$assignedUser' },
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'assignedUser.roleId',
          foreignField: '_id',
          as: 'assignedUserRole',
        },
      },
      {
        $unwind: { path: '$assignedUserRole' },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owner',
        },
      },
      {
        $unwind: { path: '$owner' },
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'owner.roleId',
          foreignField: '_id',
          as: 'ownerRole',
        },
      },
      {
        $unwind: { path: '$ownerRole' },
      },
      {
        $project: {
          status: 1,
          priority: 1,
          tags: 1,
          businessId: 1,
          title: 1,
          deadline: 1,
          reminder: 1,
          attachments: 1,
          createdAt: 1,
          ownerId: 1,
          description: 1,
          dueDate: 1,
          'owner.roleId': 1,
          'owner.firstName': 1,
          'owner.lastName': 1,
          'owner.photo': 1,
          'ownerRole._id': 1,
          'ownerRole.name': 1,
          'ownerRole.slug': 1,
          'assignedUser.roleId': 1,
          'assignedUser.firstName': 1,
          'assignedUser.lastName': 1,
          'assignedUser.photo': 1,
          'assignedUserRole._id': 1,
          'assignedUserRole.name': 1,
          'assignedUserRole.slug': 1,
        },
      },
    ]);
    return task[0];
  }

  async getTasks(conditions: any, options: getTasksDTO) {
    console.log('con', conditions);
    const { limit = 20, page = 1, sort } = options;
    const [data, total] = await Promise.all([
      this.schemaModel.aggregate([
        {
          $match: conditions,
        },
        {
          $lookup: {
            from: 'users',
            localField: 'assignedTo',
            foreignField: '_id',
            as: 'assignedUser',
          },
        },
        {
          $unwind: { path: '$assignedUser' },
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'assignedUser.roleId',
            foreignField: '_id',
            as: 'assignedUserRole',
          },
        },
        {
          $unwind: { path: '$assignedUserRole' },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'ownerId',
            foreignField: '_id',
            as: 'owner',
          },
        },
        {
          $unwind: { path: '$owner' },
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'owner.roleId',
            foreignField: '_id',
            as: 'ownerRole',
          },
        },
        {
          $unwind: { path: '$ownerRole' },
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
        {
          $project: {
            status: 1,
            priority: 1,
            tags: 1,
            businessId: 1,
            title: 1,
            deadline: 1,
            attachments: 1,
            createdAt: 1,
            ownerId: 1,
            description: 1,
            dueDate: 1,
            reminder: 1,
            assignedTo: 1,
            'owner.roleId': 1,
            'owner.firstName': 1,
            'owner.lastName': 1,
            'owner.photo': 1,
            'ownerRole._id': 1,
            'ownerRole.name': 1,
            'ownerRole.slug': 1,
            'assignedUser.roleId': 1,
            'assignedUser.firstName': 1,
            'assignedUser.lastName': 1,
            'assignedUser.photo': 1,
            'assignedUserRole._id': 1,
            'assignedUserRole.name': 1,
            'assignedUserRole.slug': 1,
          },
        },
      ]),
      this.count(conditions),
    ]);
    const meta = this.getMeta({ total, data, limit, page });
    return { data, meta };
  }
}

export default new TaskRepository(Task);
