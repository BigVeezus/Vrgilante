import { addBusinessIdToRequest, addUserToRequest, authenticateUser } from '../../middlewares/AuthMiddleware';
import { APIHelper, APIRouter } from '../../middlewares/APIHandlers';
import * as documentController from './document.controller';
import { evidenceUploadHandler } from '../../middlewares/FileHandler';

const router = APIRouter();

router.post('/', authenticateUser(), addBusinessIdToRequest(), addUserToRequest(), evidenceUploadHandler(), (req, res) => APIHelper({ req, res, controller: documentController.createDocument }));

router.patch('/status/:documentId/update', authenticateUser(), addBusinessIdToRequest(), addUserToRequest(), (req, res) => APIHelper({ req, res, controller: documentController.updateDocument }));

router.get('/mapped/:requirementId', authenticateUser(),addBusinessIdToRequest(), (req, res) => APIHelper({ req, res, controller: documentController.getMapDocuments }));

router.get('/:documentId', authenticateUser(), (req, res) => APIHelper({ req, res, controller: documentController.getDocument }));

router.get('/', authenticateUser(), addBusinessIdToRequest(), (req, res) => APIHelper({ req, res, controller: documentController.getDocuments }));

export default router;
