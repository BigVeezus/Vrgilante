import mongoose from 'mongoose';
import subRequirementRepository from './sub-requirement.repository';

export const updateSubRequirementService = async (requirementId: mongoose.Types.ObjectId, status: string) => {
  // for (let i = 0; i < requirementIds.length; i++) {
  await subRequirementRepository.findOneAndUpdate(requirementId, {
    status: status,
  });
  // }
  return 'done';
};
