import { NextFunction, Request, Response } from 'express';
import { evidenceDocument, uploadDocument, uploadMedia } from '../modules/uploadHandler/multer.service';
import multer from 'multer';

export const fileUploadHandler = () => {
  return async function (req: Request, res: Response, next: NextFunction) {
    uploadDocument.array('files', 10)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).send('File upload error: ' + err.message);
      } else if (err as Error) {
        return res.status(400).send({
          success: false,
          message: err.message,
        });
      }

      next();
    });
  };
};

export const evidenceUploadHandler = () => {
  return async function (req: Request, res: Response, next: NextFunction) {
    evidenceDocument.array('files', 2)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).send('File upload error: ' + err.message);
      } else if (err as Error) {
        return res.status(400).send({
          success: false,
          message: err.message,
        });
      }

      next();
    });
  };
};

export const mediaFileUploadHandler = () => {
  return async function (req: Request, res: Response, next: NextFunction) {
    uploadMedia.array('files', 10)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).send('File upload error: ' + err.message);
      } else if (err as Error) {
        return res.status(400).send({
          success: false,
          message: err.message,
        });
      }

      next();
    });
  };
};
