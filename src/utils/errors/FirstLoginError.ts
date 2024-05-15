import { StatusCodes } from 'http-status-codes';
import { BaseError } from './BaseError';
import { errorMessages, errorTypes } from './errorsConstants';
import { ErrorProps } from './errorsInterface';

export class FirstTimeLoginException extends BaseError {
  constructor({ verboseMessage }: Partial<ErrorProps>) {
    super({
      message: errorMessages.firstTimeLoginMessage,
      httpCode: StatusCodes.PRECONDITION_REQUIRED,
      errorType: errorTypes.ACTION_REQUIRED,
      verboseMessage,
    });
  }
}
