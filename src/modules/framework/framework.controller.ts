import { BadRequestException, validate } from '../../utils';
import { CreateFrameworkDTO, GetAllFrameworksDTO, GetID, GetMultipleFrameworksRequirementDTO, GetOneBusinessFrameworkID, RequirementUploadDTO } from './framework.interface';
import * as frameworkService from './framework.service';
import * as requirementService from '../requirement/requirement.service';
import * as requirementHeaderService from '../requirement/requirementHeader/requirementHeader.service';
import { GetOneBusinessFrameworkParam, createFrameworkValidation, getMultipleFrameworksRequirement } from './framework.validator';
import mongoose from 'mongoose';

export const frameworkCreation = async (params: CreateFrameworkDTO) => {
  const value = validate(params, createFrameworkValidation);
  const data = await frameworkService.createFramework(value);
  return {
    data,
    message: 'Sucessfully created framework',
  };
};

export const getAllFrameworks = async (payload: GetAllFrameworksDTO) => {
  const data = await frameworkService.getAllFrameworks(payload);
  return {
    data,
    message: 'get all frameworks',
  };
};

export const getOneFramework = async (param: GetID) => {
  const data = await frameworkService.getOneFramework(param);
  return {
    data,
    message: 'get one framework',
  };
};

export const getFrameworkByBusiness = async (param: GetOneBusinessFrameworkID) => {
  const value = validate(param, GetOneBusinessFrameworkParam);
  const data = await frameworkService.getOneBusinessFramework(param);
  return {
    data,
    message: 'get one business framework',
  };
};

export const uploadRequirements = async (params: RequirementUploadDTO) => {
  const data = await frameworkService.readCSV(params);
  const { subRequirementsArr, requirementsArr, headersArr } = data;
  console.log(subRequirementsArr.length, requirementsArr.length, headersArr.length);
  if (requirementsArr.length == 0 || headersArr.length == 0) {
    throw new BadRequestException({ message: 'error parsing csv or empty csv' });
  }
  if (!params.frameworkId) throw new BadRequestException({ message: 'no framework id in params' });
  await requirementHeaderService.createRequirementHeader(headersArr, params.frameworkId);
  await requirementService.createRequirements(requirementsArr, params.frameworkId);
  await requirementService.createSubRequirements(subRequirementsArr, params.frameworkId);
  return {
    data,
    message: 'csv read successfully',
  };
};

export const getMulitpleFrameworksReq = async (params: GetMultipleFrameworksRequirementDTO) => {
  const value = validate(params, getMultipleFrameworksRequirement);
  const data = await frameworkService.getMultipleFrameworksRequirements(value);
  return {
    data,
    message: 'Requirements retrieved successfully',
  };
};
