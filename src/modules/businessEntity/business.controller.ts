import { BadRequestException, ResourceNotFoundError, validate } from '../../utils';
import * as businessService from './business.service';
import * as evidenceService from '../evidence/evidence.service';
import * as businessFrameworkService from './business-framework/business-framework.service';
import {
  AddFrameworkToBusinessDTO,
  AddRequirementToBusinessDTO,
  BusinessID,
  CreateBusinessDTO,
  GetAllBusinessesDTO,
  GetBusinessRequirementDTO,
  GetBusinessUsersDTO,
  InviteNewBusinessAdminDTO,
  businessProfileDTO,
  AddEvidenceDTO,
  updateTakeLookAroundStatusDTO,
  RequirementIdDTO,
} from './business.interface';
import {
  businessIdValidation,
  createBusinessValidation,
  evidenceValidation,
  fetchAllBusinessUsersValidation,
  fetchAllBusinessesValidation,
  frameworkToBusinessValidation,
  inviteBusinessAdminValidation,
} from './business.validation';
import { GetID } from '../../modules/framework/framework.interface';
import businessRepository from './business.repository';
import frameworkRepository from '../../modules/framework/framework.repository';
import requirementRepository from '../../modules/requirement/requirement.repository';
import businessFrameworkRepository from './business-framework/business-framework.repository';

export const businessOptions = async () => {
  const data = businessService.getBusinessOptions();
  return {
    data,
    message: 'Business options fetched successfully',
  };
};

export const getBusinessUsers = async (params: GetBusinessUsersDTO) => {
  const value = validate(params, fetchAllBusinessUsersValidation);
  const data = await businessService.fetchBusinessUsers(value);
  return {
    data,
    message: 'Fetched business users successfully',
  };
};

export const getBusinesses = async (params: GetAllBusinessesDTO) => {
  const value = validate(params, fetchAllBusinessesValidation);
  const data = await businessService.fetchBusinesses(value);
  return {
    data,
    message: 'Fetched businesses successfully',
  };
};

export const onboardingProgress = async (params: businessProfileDTO) => {
  const data = await businessService.onboardingAnalytics(params);
  return {
    data,
    message: 'Business Onboarding Progress',
  };
};

export const inviteBusinessAdmin = async (params: InviteNewBusinessAdminDTO) => {
  const value = validate(params, inviteBusinessAdminValidation);
  const data = await businessService.inviteNewBusinessAdmin(value);
  return {
    data,
    message: 'Successfully invited business admin to vegeel app account',
  };
};

export const businessCreation = async (params: CreateBusinessDTO) => {
  const value = validate(params, createBusinessValidation);
  const data = await businessService.createBusiness(value);
  return {
    data,
    message: 'Sucessfully created business account',
  };
};

export const addFrameworktoBusiness = async (params: AddFrameworkToBusinessDTO) => {
  const value = validate(params, frameworkToBusinessValidation);
  const business = await businessRepository.findById(params.businessId);
  if (!business) throw new ResourceNotFoundError({ message: 'business not found' });
  const framework = await frameworkRepository.findById(params.frameworkId);
  if (!framework) throw new ResourceNotFoundError({ message: 'framework not found' });
  const data = await businessFrameworkService.addFrameworktoBusiness(value);
  return {
    data,
    message: 'Sucessfully added framework to business',
  };
};

export const getBusinessFrameworks = async (params: BusinessID) => {
  const business = await businessRepository.findById(params.businessId);
  if (!business) throw new ResourceNotFoundError({ message: 'business not found' });
  const data = await businessFrameworkService.getFrameworksByBusinessId(params);
  return {
    data,
    message: 'Sucessfully got all business frameworks',
  };
};

export const completeTakeALookAround = async (params: updateTakeLookAroundStatusDTO) => {
  const value = validate(params, businessIdValidation);
  const data = await businessService.updateTakeLookAroundStatus(value);
  return {
    data,
    message: 'Take look around completed successfully',
  };
};

export const addRequirement = async (params: AddRequirementToBusinessDTO) => {
  if (!params.businessId) throw new BadRequestException({ message: 'business id not found' });
  const data = await businessService.addRequirement(params);
  return {
    data,
    message: 'Sucessfully added requirement',
  };
};

export const addRequirementEvidence = async (params: AddEvidenceDTO) => {
  const value = validate(params, evidenceValidation);
  const requirement = await requirementRepository.findById(params.requirementId);
  if (!requirement) throw new BadRequestException({ message: 'framework not found' });
  const frameworkId = requirement.frameworkId;
  const exists = await businessFrameworkRepository.findOne({ businessId: params.businessId, frameworkId: frameworkId });
  if (!exists) throw new BadRequestException({ message: 'framework has not been added to business' });
  const payload = {
    ...params,
    frameworkId: frameworkId.toHexString(),
  };
  const data = await evidenceService.addEvidence(payload);
  return {
    data,
    message: 'Sucessfully added evidence',
  };
};

export const getAllBusinessEvidencesByBusiness = async (params: BusinessID) => {
  if (!params.businessId) throw new BadRequestException({ message: 'business id not found' });
  const data = await evidenceService.getBusinessEvidence(params);
  return {
    data,
    message: 'Sucessfully got business evidence',
  };
};

export const getEvidencesByRequirement = async (params: RequirementIdDTO) => {
  // const data = await evidenceService.getBusinessEvidence(params);
  if (!params.requirementId) throw new BadRequestException({ message: 'requirement id not found' });
  const data = await evidenceService.getRequirementEvidence(params);
  return {
    data,
    message: 'Sucessfully got requirement evidences',
  };
};

export const getBusinessRequirement = async (params: GetBusinessRequirementDTO) => {
  if (!params.businessId) throw new BadRequestException({ message: 'business id not found' });
  const data = await businessService.getBusinessRequirements(params);
  return {
    data,
    message: 'Sucessfully got business requirement',
  };
};
