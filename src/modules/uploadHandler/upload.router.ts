import { addBusinessIdToRequest, authenticateUser } from '../../middlewares/AuthMiddleware';
import { APIHelper, APIRouter } from '../../middlewares/APIHandlers';
import * as uploadcontroller from './upload.controller';
import { fileUploadHandler, mediaFileUploadHandler } from '../../middlewares/FileHandler';

const router = APIRouter();

router.post('/document', authenticateUser(), addBusinessIdToRequest(), fileUploadHandler(), (req, res) => APIHelper({ req, res, controller: uploadcontroller.documentUpload }));

router.post('/media', authenticateUser(), addBusinessIdToRequest(), mediaFileUploadHandler(), (req, res) => APIHelper({ req, res, controller: uploadcontroller.mediaUpload }));

export default router;
