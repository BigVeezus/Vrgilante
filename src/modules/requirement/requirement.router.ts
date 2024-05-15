import { addBusinessIdToRequest, addUserToRequest, authenticateAdminUser, authenticateUser } from '../../middlewares/AuthMiddleware';
import { APIHelper, APIRouter } from '../../middlewares/APIHandlers';
import { fileUploadHandler } from '../../middlewares/FileHandler';
import * as requirementController from '../requirement/requirement.controller';

const router = APIRouter();
router.post('/update', authenticateAdminUser(), (req, res) => APIHelper({ req, res, controller: requirementController.completeRequirementStatus }));
// router.get('/', authenticateAdminUser(), (req, res) => APIHelper({ req, res, controller: frameworkController.getAllFrameworks, expectPayload: false }));
// router.get('/:id', (req, res) => APIHelper({ req, res, controller: frameworkController.getOneFramework }));
// router.post('/csv', authenticateAdminUser(), fileUploadHandler(), (req, res) => APIHelper({ req, res, controller: frameworkController.uploadRequirements }));

// router.post('/multiple/requirements', authenticateUser(), (req, res) => APIHelper({ req, res, controller: frameworkController.getMulitpleFrameworksReq }));

export default router;
