import { StatusCodes } from 'http-status-codes';
import { BaseError } from './BaseError';
import { errorMessages, errorTypes } from './errorsConstants';
import { ErrorProps } from './errorsInterface';

export class BadRequestException extends BaseError {
  constructor({ message, verboseMessage }: Partial<ErrorProps>) {
    super({
      message: message || errorMessages.InternalServerErrorMessage,
      httpCode: StatusCodes.BAD_REQUEST,
      errorType: errorTypes.BAD_REQUEST_EXCEPTION,
      verboseMessage,
    });
  }
}
