import multer from 'multer';
import path from 'path';

const mediaStorage = multer.diskStorage({
  destination: './uploads/media',
  filename: (req, file, cb) => {
    cb(null, `${file.filename}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const documentStorage = multer.diskStorage({
  destination: './uploads/documents',
  filename: (req, file, cb) => {
    cb(null, `${file.filename}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const mediaFileFilter = (req: any, file: { mimetype: string }, cb: (arg0: Error | null, arg1: boolean) => void) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(Error('file format must be either jpeg or png'), false);
  }
};

const documentFileFilter = (req: any, file: { mimetype: string }, cb: (arg0: Error | null, arg1: boolean) => void) => {
  if (file.mimetype === 'text/csv' || file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.ms-excel') {
    cb(null, true);
  } else {
    cb(new Error(`file format must be either csv or pdf, this file mimeType is ${file.mimetype}`), false);
  }
};

const msWordFileFilter = (req: any, file: { mimetype: string }, cb: (arg0: Error | null, arg1: boolean) => void) => {
  if (file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new Error('file format must be .doc or .docx'), false);
  }
};

export const uploadMedia = multer({
  storage: mediaStorage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: mediaFileFilter,
});

export const uploadDocument = multer({
  storage: documentStorage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: documentFileFilter,
});

export const evidenceDocument = multer({
  storage: documentStorage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: msWordFileFilter,
});
