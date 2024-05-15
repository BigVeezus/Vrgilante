import { addBusinessIdToRequest, addUserToRequest, authenticateUser } from '../../middlewares/AuthMiddleware';
import { APIHelper, APIRouter } from '../../middlewares/APIHandlers';
import * as taskController from './task.controller';

const router = APIRouter();

router.post('/', authenticateUser(), addBusinessIdToRequest(), addUserToRequest(), (req, res) => APIHelper({ req, res, controller: taskController.createNewTask }));

router.get('/', authenticateUser(), addBusinessIdToRequest(), (req, res) => APIHelper({ req, res, controller: taskController.getTasks, expectPayload: false }));

router.get('/:taskId', authenticateUser(), addBusinessIdToRequest(), (req, res) => APIHelper({ req, res, controller: taskController.getTask, expectPayload: false }));

router.put('/:taskId', authenticateUser(), addBusinessIdToRequest(), addUserToRequest(), (req, res) => APIHelper({ req, res, controller: taskController.taskUpdate }));

router.patch('/:taskId', authenticateUser(), addBusinessIdToRequest(), addUserToRequest(), (req, res) => APIHelper({ req, res, controller: taskController.assignTask }));

router.patch('/status/:taskId', authenticateUser(), addBusinessIdToRequest(), addUserToRequest(), (req, res) => APIHelper({ req, res, controller: taskController.updateStatus }));

router.delete('/:taskId', authenticateUser(), addBusinessIdToRequest(), addUserToRequest(), (req, res) => APIHelper({ req, res, controller: taskController.deleteTask }));
export default router;
