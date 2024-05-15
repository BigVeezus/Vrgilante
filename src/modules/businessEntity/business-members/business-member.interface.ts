import mongoose from 'mongoose';

export interface InviteMemberDTO {
  businessId: mongoose.Types.ObjectId;
  roleId: mongoose.Types.ObjectId;
  email: string;
}

export interface ChangeTeamMemberPasswordDTO {
  resetToken: string;
  newPassword: string;
}

export interface GetBusinessMembersDTO {
  businessId: mongoose.Types.ObjectId;
  search?: string;
}

export interface EditMemberRoleDTO {
  businessId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  roleId?: mongoose.Types.ObjectId;
  disable: boolean;
}

export interface DeleteMemberDTO {
  businessId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}
