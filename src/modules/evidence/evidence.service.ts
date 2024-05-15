import { generateReference, generateTemporaryPassword, getAllPermissions } from '../../utils/misc';
import { BadRequestException } from '../../utils/errors/BadRequestException';
import mongoose from '../../utils/mongo';
import {
  AddFrameworkToBusinessDTO,
  BusinessID,
  CreateBusinessDTO,
  GetAllBusinessesDTO,
  GetBusinessUsersDTO,
  InviteNewBusinessAdminDTO,
  RequirementIdDTO,
  businessProfileDTO,
} from '../../modules/businessEntity/business.interface';
import businessRepository from './evidence.repository';
import slugify from 'slugify';
import { auditorPermissions, superAdminPermissions, supportStaffPermissions, systemAdministratorPermission, vegeelSuperAdminPermissions } from '../role/permission';
import { userTypes } from '../users/users.enum';
import bcrypt from 'bcrypt';
import businessFrameworkRepository from './evidence.repository';
import { EvidenceDTO } from './evidence.interface';
import evidenceRepository from './evidence.repository';
var mammoth = require('mammoth');
import fs from 'fs';
import evidenceHistoryRepository from './evidenceHistory/evidence-history.repository';

export const addEvidence = async (payload: EvidenceDTO) => {
  let text: string = '';
  // let messages: string = '';
  if (!payload.files[0]) {
    throw new BadRequestException({ message: 'no file uploaded' });
  }

  await new Promise<void>((resolve, reject) => {
    mammoth
      .convertToHtml({ path: payload.files[0].path })
      .then(function (result: any) {
        var html = result.value; // The generated HTML
        console.log(html);
        text = text.concat(html);
        var messages = result.messages;
        console.log(messages);
        // messages = messages.concat(messages);
        fs.unlinkSync(payload.files[0].path);
        resolve();
      })
      .catch(function (error: any) {
        console.error(error);
        fs.unlinkSync(payload.files[0].path);
        reject(error);
      });
  });

  const evidence = await evidenceRepository.create({
    businessId: new mongoose.Types.ObjectId(payload.businessId),
    frameworkId: new mongoose.Types.ObjectId(payload.frameworkId),
    requirementId: new mongoose.Types.ObjectId(payload.requirementId),
    evidenceTitle: payload.evidenceTitle,
    content: text,
  });

  const historyPayload = {
    evidenceId: evidence._id,
    description: 'Added new evidence' + ' ' + payload.evidenceTitle,
    modifiedBy: payload.user?._id,
  };

  await evidenceHistoryRepository.create(historyPayload);
  return evidence;
};

export const getBusinessEvidence = async (param: BusinessID) => {
  return await evidenceRepository.find({ businessId: param.businessId });
};

export const getRequirementEvidence = async (param: RequirementIdDTO) => {
  return await evidenceRepository.find({ requirementId: param.requirementId });
};
