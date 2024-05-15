import { APIHelper, APIRouter } from '../../middlewares/APIHandlers';
import * as roleController from './role.controller';

const router = APIRouter();
router.get('/', (req, res) => APIHelper({ req, res, controller: roleController.getRoles, expectPayload: false }));

export default router;
