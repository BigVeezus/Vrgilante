import { Router } from 'express';
import users from '../../modules/users/users.router';
import businesses from '../../modules/businessEntity/business.router';
import businessRequirement from '../../modules/businessEntity/business-requirement/business-requirement.router';
import upload from '../../modules/uploadHandler/upload.router';
import task from '../../modules/taskManager/task.router';
import framework from '../../modules/framework/framework.router';
import evidence from '../../modules/evidence/evidence.router';
import document from '../../modules/document/document.router';
import template from '../../modules/templates/template.router';
import commenting from '../../modules/commentingReplies/commentReplies.router';
import roles from '../../modules/role/role.router';

const router = Router();
router.use('/users', users);
router.use('/businesses', businesses);
router.use('/upload', upload);
router.use('/task', task);
router.use('/framework', framework);
router.use('/requirement', businessRequirement);
router.use('/evidence', evidence);
router.use('/document', document);
router.use('/template', template);
router.use('/comment', commenting);
router.use('/role', roles);

export default router;
