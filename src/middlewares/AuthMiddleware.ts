import { NextFunction, Request, Response } from 'express';
import { env } from '../utils';
import { authorizationFailed, noAuthorization, resourceDenied, jwtExpired } from './middlewareConstants';
import { StatusCodes } from 'http-status-codes';
import { verify, TokenExpiredError } from 'jsonwebtoken';
import { getUserID, getRevokedToken } from '../modules/users/users.service';
import { userTypes } from '../utils/constant';

export const authenticateUser = () => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const headerToken = req.headers['authorization'];
      if (!headerToken) return handleErrorResponse(res, noAuthorization);
      const token = getToken(headerToken);
      if (!token) return handleErrorResponse(res, authorizationFailed);
      const checkLogout = await getRevokedToken(token);
      if (checkLogout) return handleErrorResponse(res, authorizationFailed);
      const verifyToken: any = verify(token, env('JWT_SECRET'));
      if (Date.now() >= verifyToken.exp * 1000) return handleErrorResponse(res, jwtExpired);
      const user = await getUserID({ id: verifyToken.sub });
      if (!user) return handleErrorResponse(res, authorizationFailed);
      if (user.status == 'invited' || user.firstTimeLogin == true) return handleErrorResponse(res, { message: 'Kindly complete profile setup', type: 'PROFILE_SETUP' });
      res.locals.user = user;
      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return handleErrorResponse(res, jwtExpired);
      }
      next(error);
    }
  };
};

export const addBusinessIdToRequest = () => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      req.query.businessId = res.locals.user.businessId.toString();
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const addUserToRequest = () => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      req.query.user = res.locals.user;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const addHeaderTokenToRequest = () => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const headerToken = req.headers['authorization'];
      if (!headerToken) return handleErrorResponse(res, noAuthorization);
      const token = getToken(headerToken);
      req.query.token = token;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const authenticateAdminUser = () => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const headerToken = req.headers['authorization'];
      if (!headerToken) return handleErrorResponse(res, noAuthorization);
      const token = getToken(headerToken);
      if (!token) return handleErrorResponse(res, authorizationFailed);
      const checkLogout = await getRevokedToken(token);
      if (checkLogout) return handleErrorResponse(res, authorizationFailed);
      const verifyToken: any = verify(token, env('JWT_SECRET'));
      if (Date.now() >= verifyToken.exp * 1000) return handleErrorResponse(res, jwtExpired);
      const user = await getUserID({ id: verifyToken.sub });
      if (!user) return handleErrorResponse(res, authorizationFailed);
      if (user.userType != userTypes.VEGEEL) return handleErrorResponse(res, resourceDenied);
      res.locals.user = user;
      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return handleErrorResponse(res, jwtExpired);
      }
      next(error);
    }
  };
};

export const authenticateBusinessOwner = () => {
  return async function (req: Request, res: Response, next: NextFunction) {
    if (!res.locals.user.isOwner) return res.status(400).send({ success: false, message: 'Only business admin can permission this action', errorType: 'ACCESS_DENIED' });
    next();
  };
};
const getToken = (headerToken: string) => {
  const token = headerToken.split(' ')[1];
  return token;
};

export const handleErrorResponse = (res: Response, errorObject: any) => {
  const errorData = { success: false, message: errorObject.message, errorType: errorObject.Type };
  return res.status(StatusCodes.UNAUTHORIZED).send(errorData);
};
