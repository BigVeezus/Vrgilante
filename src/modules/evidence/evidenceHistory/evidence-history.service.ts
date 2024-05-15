import { GetEvidenceHistoryDTO } from '../evidence.interface';
import evidenceHistoryRepository from './evidence-history.repository';

export const getEvidenceHistory = async (payload: GetEvidenceHistoryDTO) => {
  return await evidenceHistoryRepository.find({ evidenceId: payload.evidenceId });
};
