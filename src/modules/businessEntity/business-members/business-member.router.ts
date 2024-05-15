import { addBusinessIdToRequest, addUserToRequest, authenticateAdminUser, authenticateBusinessOwner, authenticateUser } from '../../../middlewares/AuthMiddleware';
import { APIHelper, APIRouter } from '../../../middlewares/APIHandlers';
import * as businessController from '../business.controller';
import * as businessMemberController from './business-member.controller';
import { evidenceUploadHandler } from '../../../middlewares/FileHandler';

const router = APIRouter();

// router.post('/change-password', (req, res) => APIHelper({ req, res, controller: businessMemberController.changeTeamMemberPassword }));

export default router;
