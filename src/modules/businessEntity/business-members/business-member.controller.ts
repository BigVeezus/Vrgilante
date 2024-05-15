import usersRepository from '../../../modules/users/repositories/users.repository';
import roleRepository from '../../../modules/role/role.repository';
import { BadRequestException, ResourceNotFoundError, validate } from '../../../utils';
import businessRepository from '../business.repository';
import bcrypt from 'bcrypt';
import { inviteTeamMemberValidation, teamChangePasswordValidation } from '../business.validation';
import { DeleteMemberDTO, ChangeTeamMemberPasswordDTO, EditMemberRoleDTO, GetBusinessMembersDTO, InviteMemberDTO } from './business-member.interface';
import * as businessTeamMemberService from './business-member.service';
import * as mailService from '../../notification/mail/mailService';

export const inviteTeamMember = async (params: InviteMemberDTO) => {
  validate(params, inviteTeamMemberValidation);
  const business = await businessRepository.findById(params.businessId);
  if (!business) throw new ResourceNotFoundError({ message: 'business not found' });

  const role = await roleRepository.findById(params.roleId);
  if (!role) throw new ResourceNotFoundError({ message: 'role not found' });
  const data = await businessTeamMemberService.inviteTeamMember(params, role.permissions, role._id);

  //send mail
  await mailService.sendPasswordReset({
    firstName: data.firstName,
    token: data.resetPasswordToken!,
    // token: 'jfj',
    email: data.email,
  });
  return {
    data: '',
    message: 'Sucessfully invited team member',
  };
};

export const changeTeamMemberPassword = async (params: ChangeTeamMemberPasswordDTO) => {
  const value = validate(params, teamChangePasswordValidation);
  const user = await usersRepository.findOne({ resetPasswordToken: params.resetToken });
  if (!user) throw new BadRequestException({ message: 'no user found' });

  // if (params.newPassword.length < 6) throw new BadRequestException({ message: 'password should be at least 6 letters long' });
  // console.log(user);
  const salt = await bcrypt.genSalt(10);
  const passwordHashed: string = await bcrypt.hash(value.newPassword, salt);

  await usersRepository.findOneAndUpdate(
    { email: user.email },
    {
      status: 'active',
      password: passwordHashed,
    },
  );

  return {
    data: '',
    message: 'Sucessfully onboarded team member',
  };
};

export const getAllBusinessMembers = async (params: GetBusinessMembersDTO) => {
  const data = await businessTeamMemberService.getMembersByBusiness(params);
  return {
    data,
    message: 'Sucessfully get all business members',
  };
};

export const editBusinessMember = async (params: EditMemberRoleDTO) => {
  let roleData: any;
  if (params.roleId) {
    const role = await roleRepository.findById(params.roleId);
    roleData = role;
    if (!role) throw new ResourceNotFoundError({ message: 'role not found' });
  }

  if (!params.roleId && !params.disable) {
    throw new ResourceNotFoundError({ message: 'no role Id found and disable is false' });
  }

  const data = await businessTeamMemberService.editMember(params, roleData?.permissions, params.roleId);
  return {
    data,
    message: 'Sucessfully edit business member role',
  };
};

export const deleteMember = async (params: DeleteMemberDTO) => {
  const data = await businessTeamMemberService.deleteMember(params);
  return {
    data,
    message: 'Sucessfully deleted business member',
  };
};
