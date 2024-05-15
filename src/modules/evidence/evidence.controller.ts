import { validate } from '../../utils/validator';
import { GetEvidenceHistoryDTO } from './evidence.interface';
import * as evidenceHistoryService from './evidenceHistory/evidence-history.service';
import { getEvidenceHistoryValidator } from './evidence.validator';

export const getEvidencesHistory = async (params: GetEvidenceHistoryDTO) => {
  const value = validate(params, getEvidenceHistoryValidator);
  const data = await evidenceHistoryService.getEvidenceHistory(value);
  return {
    data,
    message: 'Sucessfully got evidence history',
  };
};
