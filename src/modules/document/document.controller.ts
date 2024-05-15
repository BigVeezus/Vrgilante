import { validate } from '../../utils';
import { DocumentDTO, DocumentStatusUpdateDTO, GetDocumentByIdDTO, GetDocumentByRequirementID, GetDocumentsDTO } from './document.interface';
import { createDocumentValidator, getDocumentByRequirmentValidator, getDocumentValidator, getDocumentsValidator, updateDocumemtStatusValidator } from './document.validator';
import * as documentService from './document.service';

export const createDocument = async (params: DocumentDTO) => {
  const value = validate(params, createDocumentValidator);
  const data = await documentService.addDocument(value);
  return {
    data,
    message: 'Document added successfully',
  };
};

export const updateDocument = async (params: DocumentStatusUpdateDTO) => {
  const value = validate(params, updateDocumemtStatusValidator);
  const data = await documentService.updateDocumentStatus(value);
  return {
    data,
    message: 'Document status updated successfully',
  };
};

export const getMapDocuments = async (params: GetDocumentByRequirementID) => {
  const value = validate(params, getDocumentByRequirmentValidator);
  const data = await documentService.getDocumentsByRequirementID(value);
  return {
    data,
    message: 'Requirment Mapped Documents',
  };
};

export const getDocument = async (params: GetDocumentByIdDTO) => {
  const value = validate(params, getDocumentValidator);
  const data = await documentService.getDocument(value);
  return {
    data,
    message: 'Document retrieved',
  };
};

export const getDocuments = async (params: GetDocumentsDTO) => {
  const value = validate(params, getDocumentsValidator);
  const data = await documentService.getAllDocuments(value);
  return {
    data,
    message: 'Documents retrieved',
  };
};
