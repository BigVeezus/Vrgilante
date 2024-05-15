import { generateReference, generateTemporaryPassword, getAllPermissions } from '../../../utils/misc';
import { BadRequestException } from '../../../utils/errors/BadRequestException';
import mongoose from '../../../utils/mongo';
import { BusinessEntityTypes, IndustrySectors } from '../business.constant';
import { AddFrameworkToBusinessDTO, BusinessID, CreateBusinessDTO, GetAllBusinessesDTO, GetBusinessUsersDTO, InviteNewBusinessAdminDTO, businessProfileDTO } from '../business.interface';
import businessRepository from './business-framework.repository';
import slugify from 'slugify';
import { auditorPermissions, superAdminPermissions, supportStaffPermissions, systemAdministratorPermission, vegeelSuperAdminPermissions } from '../../role/permission';
import { userTypes } from '../../users/users.enum';
import bcrypt from 'bcrypt';
import businessFrameworkRepository from './business-framework.repository';

export const addFrameworktoBusiness = async (param: AddFrameworkToBusinessDTO) => {
  const existingData = await businessFrameworkRepository.findOne({ businessId: param.businessId, frameworkId: param.frameworkId });
  if (existingData) throw new BadRequestException({ message: 'framework already attached to business' });
  return await businessFrameworkRepository.create({
    businessId: new mongoose.Types.ObjectId(param.businessId),
    frameworkId: new mongoose.Types.ObjectId(param.frameworkId),
    createdBy: {
      name: param.user.firstName + ' ' + param.user.lastName,
      adminId: param.user._id,
    },
  });
};

export const getFrameworksByBusinessId = async (params: BusinessID) => {
  const { data, meta } = await businessFrameworkRepository.findAndPopulate({ businessId: params.businessId }, { page: params.page, limit: params.limit }, [{ path: 'frameworkId' }], {});
  return {
    frameworks: data,
    meta,
  };
};
