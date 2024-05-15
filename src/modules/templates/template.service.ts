import { generateReference, generateTemporaryPassword, getAllPermissions } from '../../utils/misc';
import { BadRequestException } from '../../utils/errors/BadRequestException';
import mongoose from '../../utils/mongo';
import { auditorPermissions, superAdminPermissions, supportStaffPermissions, systemAdministratorPermission, vegeelSuperAdminPermissions } from '../role/permission';
import { userTypes } from '../users/users.enum';
import templateRepository from './template.repository';
import frameworkRepository from '../../modules/framework/framework.repository';
import { ResourceNotFoundError } from '../../utils';
import { CreateTemplatePayload, EditTemplateDto, GetAllTemplatesDTO, GetOneTemplateDTO } from './template.interface';
var mammoth = require('mammoth');
import fs from 'fs';
import { param } from 'express-validator';

export const createTemplate = async (payload: CreateTemplatePayload) => {
  const framework = await frameworkRepository.findById(payload.frameworkId);
  if (!framework) throw new ResourceNotFoundError({ message: 'framework not found' });

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
        // console.log(html);
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

  return await templateRepository.create({
    frameworkId: framework._id,
    frameworkName: framework.title,
    title: payload.title,
    content: text,
  });
};

export const getAllTemplates = async (params: GetAllTemplatesDTO) => {
  const title = params.frameworkTitle || '';
  const frameworkId = params.frameworkId || '';
  const limit = Number(params.limit) || 20;
  const currentPage = Number(params.page) || 1;
  const skip = limit * (currentPage - 1);

  const filters = {
    ...(title != '' && {
      frameworkName: title,
    }),
    ...(frameworkId != '' && {
      frameworkId: frameworkId,
    }),
  };

  const templates = await templateRepository.templateModel.aggregate([
    { $match: filters },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $limit: limit,
    },
    {
      $skip: skip,
    },
  ]);

  const count = await templateRepository.count(filters);

  return {
    templates,
    count,
    currentPage,
  };
};

export const getOneTemplate = async (params: GetOneTemplateDTO) => {
  return templateRepository.findById(params.templateId);
};

export const editTemplate = async (params: EditTemplateDto) => {
  const payload = {
    title: params.title,
    content: params.content,
  };
  return await templateRepository.findOneAndUpdate(new mongoose.Types.ObjectId(params.templateId), payload);
};

export const deleteTemplate = async (params: GetOneTemplateDTO) => {
  // console.log(params.templateId);
  await templateRepository.findOneAndDelete(new mongoose.Types.ObjectId(params.templateId));
};
