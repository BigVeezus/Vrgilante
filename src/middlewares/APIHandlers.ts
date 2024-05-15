import { Request, Response, Router } from 'express';
import { logger, isEmpty, UnprocessableEntityError, RequestedResourceDeniedError, errorMessages } from '../utils';

interface APIHelperDTO {
  req: Request | any;
  res: Response;
  controller: Function;
  expectPayload?: boolean;
  permission?: string;
  include?: string[];
}

/**
 *
 * @param req
 * @param res
 * @param controller
 * @param expectPayload
 * @param permission
 */
export async function APIHelper({ req, res, controller, expectPayload = true, permission, include }: APIHelperDTO): Promise<any> {
  try {
    if (typeof req.body != 'undefined' && Array.isArray(req.body)) {
      throw new UnprocessableEntityError({
        message: 'Request body must be of type object',
      });
    }

    if (permission) {
      const authUser = res.locals.user;
      if (!authUser.role.permissions) throw new RequestedResourceDeniedError({ message: errorMessages.requestedResourceDeniedErrorMessage });
      const checkPermission = authUser.role.permissions.find((per: any) => per == permission);
      if (!checkPermission) throw new RequestedResourceDeniedError({ message: errorMessages.requestedResourceDeniedErrorMessage });
    }

    const payload = Object.assign({}, req.body, req.params, req.query);

    if (req.files) payload.files = req.files;

    if (expectPayload && Object.keys(payload).length <= 0) {
      throw new UnprocessableEntityError({ message: 'No payload sent' });
    }

    const { data, message } = await controller(include ? refineProps(req, include, payload) : payload);

    logger.info({
      message,
      data: payload,
      httpPath: req.path,
      httpMethod: req.method,
      function: controller.name,
    });

    return res.status(200).json({ success: true, statusCode: 200, message, data: data ? data : [] });
  } catch (error: any) {
    console.log('error', error);
    logger.error({
      message: error.message,
      error,
      httpPath: req.path,
      httpMethod: req.method,
      function: controller.name,
    });

    return res.status(error.httpCode || 400).json({
      success: false,
      message: error.message,
      errorType: error.errorType,
      verboseMessage: error.error,
    });
  }
}

export const APIRouter = (): Router => Router();

function refineProps(req: any, props: string[], payload: any) {
  const refinedPayload: any = { params: payload };

  for (const prop of props) {
    const propValue = req[prop];

    if (!propValue || isEmpty(propValue)) {
      logger.error({ message: `${prop} must not be undefined` });
      continue;
    }

    refinedPayload[prop] = propValue;
  }

  return refinedPayload;
}
