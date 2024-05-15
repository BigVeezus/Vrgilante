import { addBusinessIdToRequest, addUserToRequest, authenticateAdminUser, authenticateUser } from '../../middlewares/AuthMiddleware';
import { APIHelper, APIRouter } from '../../middlewares/APIHandlers';
import * as frameworkController from './framework.controller';
import { fileUploadHandler } from '../../middlewares/FileHandler';

const router = APIRouter();
router.post('/', authenticateAdminUser(), (req, res) => APIHelper({ req, res, controller: frameworkController.frameworkCreation }));
router.get('/', authenticateAdminUser(), (req, res) => APIHelper({ req, res, controller: frameworkController.getAllFrameworks, expectPayload: false }));
router.get('/:id', (req, res) => APIHelper({ req, res, controller: frameworkController.getOneFramework }));
router.get('/:id/business/:businessId', (req, res) => APIHelper({ req, res, controller: frameworkController.getFrameworkByBusiness }));

router.post('/csv', authenticateAdminUser(), fileUploadHandler(), (req, res) => APIHelper({ req, res, controller: frameworkController.uploadRequirements }));

router.post('/multiple/requirements', authenticateUser(), (req, res) => APIHelper({ req, res, controller: frameworkController.getMulitpleFrameworksReq }));

export default router;
