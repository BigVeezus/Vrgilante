interface fileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: string;
}
export interface fileUploadDTO {
  businessId: string;
  files: [fileType];
  type: string;
}
