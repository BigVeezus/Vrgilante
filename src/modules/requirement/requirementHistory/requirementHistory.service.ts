import { cSVFormat } from 'modules/framework/framework.interface';
import requirementHistoryRepository from './requirementHistory.repository';
import mongoose from 'mongoose';
import { requirementHistory } from './requirementHistory.interface';

export const storeRequirementHistory = async (payload: requirementHistory) => {
  return requirementHistoryRepository.create(payload);
};
