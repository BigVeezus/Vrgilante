import { NextFunction, Request, Response } from 'express';
import { handleErrorResponse } from './AuthMiddleware';
import { resourceDenied } from './middlewareConstants';

export const permissionGuard = () => {
  return async function (permission: string, req: Request, res: Response, next: NextFunction) {
    try {
      const authUser = res.locals.user;
      const checkPermission = authUser.permissions.find(permission);
      if (!checkPermission) return handleErrorResponse(res, resourceDenied);
      next();
    } catch (error) {
      next(error);
    }
  };
};
