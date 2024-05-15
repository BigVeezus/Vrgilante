import { addBusinessIdToRequest, addUserToRequest, authenticateAdminUser, authenticateBusinessOwner, authenticateUser } from '../../../middlewares/AuthMiddleware';
import { APIHelper, APIRouter } from '../../../middlewares/APIHandlers';
import * as businessController from '.././business.controller';
import * as requirementController from '../../requirement/requirement.controller';

const router = APIRouter();
router.get('/:requirementId/evidence', (req, res) => APIHelper({ req, res, controller: businessController.getEvidencesByRequirement }));
router.post('/update', authenticateAdminUser(), (req, res) => APIHelper({ req, res, controller: requirementController.completeRequirementStatus }));
export default router;
