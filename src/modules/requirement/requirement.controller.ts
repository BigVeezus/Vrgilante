import { CompleteRequirementStatus } from './requirement.interface';
import * as requirementService from './requirement.service';
import * as subRequirementService from './sub-requirement/sub-requirement.service';
import subRequirementRepository from './sub-requirement/sub-requirement.repository';
import { BadRequestException, validate } from '../../utils';
import businessRequirementRepository from '../../modules/businessEntity/business-requirement/business-requirement.repository';
import mongoose from 'mongoose';
import { updateRequirementStatus } from './requirement.validate';

export const completeRequirementStatus = async (params: CompleteRequirementStatus) => {
  const value = validate(params, updateRequirementStatus);
  if (!params.requirementId && !params.subRequirementId) {
    throw new BadRequestException({ message: 'either requirement or subrequirement must be present!' });
  }
  let data: any = '';
  if (params.requirementId) {
    // data = await requirementService.updateRequirementService([params.requirementId], 'COMPLETED');
    await businessRequirementRepository.create({
      requirementId: new mongoose.Types.ObjectId(params.requirementId),
      status: params.status,
      businessId: params.businessId,
    });
  }
  if (params.subRequirementId) {
    // data = await subRequirementService.updateSubRequirementService(params.subRequirementId, 'COMPLETED');
    await businessRequirementRepository.create({
      subRequirementId: new mongoose.Types.ObjectId(params.subRequirementId),
      status: params.status,
      businessId: params.businessId,
    });
  }

  return {
    data: '',
    message: 'Sucessfully updated requirement',
  };
};
