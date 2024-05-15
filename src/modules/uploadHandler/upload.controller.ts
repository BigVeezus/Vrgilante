import { fileUploadDTO } from './upload.interface';
import { validate } from '../../utils';
import { DocumentUploadValidation, MediaUploadValidation } from './upload.validation';
import * as uploadservice from './upload.service';

export const documentUpload = async (params: fileUploadDTO) => {
  const value = validate(params, DocumentUploadValidation);
  const data = await uploadservice.upload(value);
  return {
    data,
    message: 'Document uploaded successfully',
  };
};

export const mediaUpload = async (params: fileUploadDTO) => {
  const value = validate(params, MediaUploadValidation);
  const data = await uploadservice.upload(value);
  return {
    data,
    message: 'Media files uploaded successfully',
  };
};
