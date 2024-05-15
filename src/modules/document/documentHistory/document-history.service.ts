import documentHistoryRepository from './document-history.repository';
import { createDocumentHistoryDTO } from './document-history.interface';

export const storeDocumenttHistory = async (payload: createDocumentHistoryDTO) => {
  return documentHistoryRepository.create(payload);
};
