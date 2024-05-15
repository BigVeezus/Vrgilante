import { RolePermissions, generateReference, generateTemporaryPassword, getAllPermissions } from '.././../../utils/misc';
import { BadRequestException } from '../../../utils/errors/BadRequestException';
import mongoose from '../../../utils/mongo';
import slugify from 'slugify';
import { auditorPermissions, superAdminPermissions, supportStaffPermissions, systemAdministratorPermission, vegeelSuperAdminPermissions } from '../../role/permission';
import { userTypes } from '../../../modules/users/users.enum';
import bcrypt from 'bcrypt';
import { sendWelcomeEmail } from '../../../modules/notification/mail/mailService';
import { DeleteMemberDTO, EditMemberRoleDTO, GetBusinessMembersDTO, InviteMemberDTO } from './business-member.interface';
import usersRepository from '../../../modules/users/repositories/users.repository';
import { IRole } from '../../../modules/role/role.model';
import businessMemberRepository from './business-member.repository';

export const inviteTeamMember = async (params: InviteMemberDTO, permissions: string[], roleId: mongoose.Types.ObjectId | undefined) => {
  const existingUser = await usersRepository.findOne({
    email: params.email,
  });
  if (existingUser) throw new BadRequestException({ message: 'user already exists' });
  const data = await usersRepository.create({
    email: params.email,
    userType: 'business',
    resetPasswordToken: generateReference(20),
    resetPasswordExpires: new Date(Date.now() + 31536000000),
    businessId: params.businessId,
    permissions,
    roleId: roleId,
  });

  return data;
};

export const getMembersByBusiness = async (params: GetBusinessMembersDTO) => {
  // console.log(params.businessId);
  // const data = await usersRepository.findAndHideDetails({ businessId: new mongoose.Types.ObjectId(params.businessId) });
  const search = params.search || '';
  const regex = new RegExp(`${search}`, 'i');
  const filter = {
    businessId: new mongoose.Types.ObjectId(params.businessId),
    ...(search.length > 0 && {
      $and: [
        {
          $or: [{ firstName: regex }, { lastName: regex }, { 'role_data.name': regex }],
        },
      ],
    }),
  };
  const data = await usersRepository.userModel.aggregate([
    {
      $lookup: {
        from: 'roles',
        localField: 'roleId',
        foreignField: '_id',
        as: 'role_data',
      },
    },
    {
      $match: filter,
    },
  ]);
  return data;
};

export const editMember = async (params: EditMemberRoleDTO, rolePermissions: string[], roleId: mongoose.Types.ObjectId | undefined) => {
  const user = await usersRepository.findById(params.userId);
  if (!user) throw new BadRequestException({ message: 'user not found' });
  return usersRepository.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(params.userId) },
    {
      isBlocked: params.disable,
      permissions: params.disable ? [] : rolePermissions?.length > 0 ? rolePermissions : user?.permissions,
      roleId: !roleId ? user.roleId : roleId,
    },
  );
};

export const deleteMember = async (params: DeleteMemberDTO) => {
  await usersRepository.findOneAndDelete({
    _id: params.userId,
  });

  return 'success';
};
