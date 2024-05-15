import { addUserToRequest, authenticateUser, addHeaderTokenToRequest } from '../../middlewares/AuthMiddleware';
import { APIHelper, APIRouter } from '../../middlewares/APIHandlers';
import * as usercontroller from './users.controller';

const router = APIRouter();

router.post('/login', (req, res) => APIHelper({ req, res, controller: usercontroller.login }));
router.post('/edit', authenticateUser(), addUserToRequest(), (req, res) => APIHelper({ req, res, controller: usercontroller.edit }));

router.get('/verify/token', authenticateUser(), addUserToRequest(), (req, res) => APIHelper({ req, res, controller: usercontroller.userProfileDetails, expectPayload: false }));

router.get('/token/:token/verify', (req, res) => APIHelper({ req, res, controller: usercontroller.getUserByRegistrationToken, expectPayload: false }));

router.post('/password/:token/reset', (req, res) => APIHelper({ req, res, controller: usercontroller.resetPassword }));

router.post('/forgot/password', (req, res) => APIHelper({ req, res, controller: usercontroller.forgotPassword }));

router.get('/logout', authenticateUser(), addHeaderTokenToRequest(), (req, res) => APIHelper({ req, res, controller: usercontroller.userLogout, expectPayload: false }));
export default router;
