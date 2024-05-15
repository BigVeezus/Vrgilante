import { addBusinessIdToRequest, addUserToRequest, authenticateAdminUser, authenticateBusinessOwner, authenticateUser } from '../../middlewares/AuthMiddleware';
import { APIHelper, APIRouter } from '../../middlewares/APIHandlers';
import * as businessController from './business.controller';
import * as businessMemberController from '../businessEntity/business-members/business-member.controller';
import { evidenceUploadHandler } from '../../middlewares/FileHandler';

const router = APIRouter();
router.get('/options', (req, res) => APIHelper({ req, res, controller: businessController.businessOptions, expectPayload: false }));

router.get('/users', authenticateUser(), addBusinessIdToRequest(), (req, res) =>
  APIHelper({ req, res, controller: businessController.getBusinessUsers, expectPayload: false, permission: 'team:view' }),
);

router.get('/', (req, res) => APIHelper({ req, res, controller: businessController.getBusinesses, expectPayload: false }));

router.get('/onboarding/analytic', authenticateUser(), addUserToRequest(), (req, res) =>
  APIHelper({ req, res, controller: businessController.onboardingProgress, expectPayload: false, permission: 'dashboard:view' }),
);

router.post('/invite-business', authenticateAdminUser(), (req, res) => APIHelper({ req, res, controller: businessController.inviteBusinessAdmin, permission: 'businesses:invite' }));

router.get('/team/list', authenticateUser(), addBusinessIdToRequest(), (req, res) => APIHelper({ req, res, controller: businessMemberController.getAllBusinessMembers }));
router.post('/team/:userId/edit', authenticateUser(), addBusinessIdToRequest(), (req, res) =>
  APIHelper({ req, res, controller: businessMemberController.editBusinessMember, permission: 'team:manage:role' }),
);
router.post('/team/:userId/delete', authenticateUser(), addBusinessIdToRequest(), (req, res) =>
  APIHelper({ req, res, controller: businessMemberController.deleteMember, permission: 'team:manage:role' }),
);
router.post('/team/invite', authenticateUser(), addBusinessIdToRequest(), (req, res) => APIHelper({ req, res, controller: businessMemberController.inviteTeamMember, permission: 'team:manage:role' }));

router.post('/team/change-password', (req, res) => APIHelper({ req, res, controller: businessMemberController.changeTeamMemberPassword }));

router.post('/', authenticateUser(), addBusinessIdToRequest(), authenticateBusinessOwner(), (req, res) =>
  APIHelper({ req, res, controller: businessController.businessCreation, permission: 'account:onboarding' }),
);
router.post('/framework', authenticateAdminUser(), addUserToRequest(), (req, res) => APIHelper({ req, res, controller: businessController.addFrameworktoBusiness }));
router.get('/framework', authenticateUser(), addBusinessIdToRequest(), (req, res) => APIHelper({ req, res, controller: businessController.getBusinessFrameworks }));
router.post('/requirement', authenticateUser(), addBusinessIdToRequest(), (req, res) => APIHelper({ req, res, controller: businessController.addRequirement }));
router.get('/requirement', authenticateUser(), addBusinessIdToRequest(), (req, res) => APIHelper({ req, res, controller: businessController.getBusinessRequirement }));
router.post('/evidence', authenticateUser(), addUserToRequest(), addBusinessIdToRequest(), evidenceUploadHandler(), (req, res) =>
  APIHelper({ req, res, controller: businessController.addRequirementEvidence }),
);
router.get('/evidence', authenticateUser(), addBusinessIdToRequest(), (req, res) => APIHelper({ req, res, controller: businessController.getAllBusinessEvidencesByBusiness }));
router.get('/requirement/:requirementId/evidence', authenticateUser(), (req, res) => APIHelper({ req, res, controller: businessController.getEvidencesByRequirement }));
router.get('/complete/takeAlookAround', authenticateUser(), addBusinessIdToRequest(), (req, res) => APIHelper({ req, res, controller: businessController.completeTakeALookAround }));

export default router;
