import { addBusinessIdToRequest, addUserToRequest, authenticateUser } from '../../middlewares/AuthMiddleware';
import { APIHelper, APIRouter } from '../../middlewares/APIHandlers';
import * as commentController from './commentReplies.controller';

const router = APIRouter();

router.post('/', authenticateUser(), addBusinessIdToRequest(), addUserToRequest(), (req, res) => APIHelper({ req, res, controller: commentController.createComment }));

router.get('/', authenticateUser(), addBusinessIdToRequest(), (req, res) => APIHelper({ req, res, controller: commentController.getComments }));

router.get('/task/:taskId', authenticateUser(), addBusinessIdToRequest(), (req, res) => APIHelper({ req, res, controller: commentController.getCommentsByTask }));

router.post('/create/reply', authenticateUser(), addUserToRequest(), (req, res) => APIHelper({ req, res, controller: commentController.createReply }));

router.get('/:commentId/replies', authenticateUser(), (req, res) => APIHelper({ req, res, controller: commentController.getReplies }));

export default router;
