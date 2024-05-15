import { addBusinessIdToRequest, addUserToRequest, authenticateAdminUser, authenticateUser } from '../../middlewares/AuthMiddleware';
import { APIHelper, APIRouter } from '../../middlewares/APIHandlers';
import * as templateController from './template.controller';
import { evidenceUploadHandler } from '../../middlewares/FileHandler';

const router = APIRouter();
router.post('/', authenticateUser(), evidenceUploadHandler(), (req, res) => APIHelper({ req, res, controller: templateController.templateCreation }));
router.get('/', authenticateUser(), (req, res) => APIHelper({ req, res, controller: templateController.getAlltemplates, expectPayload: false }));
router.get('/:templateId', authenticateUser(), (req, res) => APIHelper({ req, res, controller: templateController.getOnetemplate }));
router.post('/:templateId/edit', authenticateAdminUser(), (req, res) => APIHelper({ req, res, controller: templateController.EditOnetemplate }));
router.post('/:templateId/delete', authenticateAdminUser(), (req, res) => APIHelper({ req, res, controller: templateController.deleteTemplate }));

export default router;
