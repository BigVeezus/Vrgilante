import { addBusinessIdToRequest, addUserToRequest, authenticateAdminUser, authenticateBusinessOwner, authenticateUser } from '../../middlewares/AuthMiddleware';
import { APIHelper, APIRouter } from '../../middlewares/APIHandlers';
import * as evidenceController from './evidence.controller';
import { evidenceUploadHandler } from '../../middlewares/FileHandler';

const router = APIRouter();
router.get('/:evidenceId/history', authenticateUser(), (req, res) => APIHelper({ req, res, controller: evidenceController.getEvidencesHistory }));
export default router;
