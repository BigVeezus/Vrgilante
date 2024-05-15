import businessRepository from '../../modules/businessEntity/business.repository';
import { fileUploadDTO } from './upload.interface';
import { v2 as cloudinary } from '../../utils';
import * as fs from 'fs';

export const upload = async (params: fileUploadDTO) => {
  const business = await businessRepository.findById(params.businessId);
  const result = [];
  for (let i = 0; i < params.files.length; i += 1) {
    const { secure_url } = await uploader(params.files[i].path, `${business?.businessInformation.legalName}-${params.type}`);
    result.push(secure_url);
    //const mediaPath = `media/${params.files[i].path}`
    //const documentPath = `./uploads/documents/${params.files[i].path}`
    //fs.unlinkSync(mediaPath);
    const path = params.files[i].path;
    console.log('path', path);
    fs.unlinkSync(path);
  }
  return result;
};

const uploader = async (path: string, folder: string) => {
  return await cloudinary.uploader.upload(path, { resource_type: 'raw', folder });
};
