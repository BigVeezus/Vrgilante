import { StatusCodes } from 'http-status-codes';
import { BaseError } from './BaseError';
import { ErrorProps } from './errorsInterface';
import { errorTypes, errorMessages } from './errorsConstants';

export class ResourceNotFoundError extends BaseError {
  constructor({ message, verboseMessage }: ErrorProps) {
    super({
      message: message || errorMessages.resourceNotFoundErrorMessage,
      httpCode: StatusCodes.NOT_FOUND,
      errorType: errorTypes.RESOURCE_NOT_FOUND,
      verboseMessage,
    });
  }
}

export class ResourceExistError extends BaseError {
  constructor({ message, verboseMessage }: ErrorProps) {
    super({
      message: message || errorMessages.resourceExistErrorMessage,
      httpCode: StatusCodes.CONFLICT,
      errorType: errorTypes.RESOURCE_EXIST,
      verboseMessage,
    });
  }
}
