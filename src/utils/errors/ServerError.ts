import { StatusCodes } from 'http-status-codes';
import { BaseError } from './BaseError';
import { ErrorProps } from './errorsInterface';
import { errorTypes, errorMessages } from './errorsConstants';

export class InternalServerError extends BaseError {
  constructor({ message, verboseMessage }: Partial<ErrorProps>) {
    super({
      message: message || errorMessages.InternalServerErrorMessage,
      httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errorType: errorTypes.INTERNAL_SERVER_ERROR,
      verboseMessage,
    });
  }
}

export class ServiceUnavailableError extends BaseError {
  constructor({ message, verboseMessage }: Partial<ErrorProps>) {
    super({
      message: message || errorMessages.serviceUnavailableErrorMessage,
      httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errorType: errorTypes.INTERNAL_SERVER_ERROR,
      verboseMessage,
    });
  }
}
