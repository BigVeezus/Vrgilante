import { ErrorProps } from './errorsInterface';
import { logger } from '../logger';
import { errorTypes, errorMessages } from './errorsConstants';
import { StatusCodes } from 'http-status-codes';

export class BaseError extends Error {
  private httpCode: number;
  private verboseMessage: any;
  private errorType?: string;
  public message: string;

  constructor({ message, httpCode, verboseMessage, errorType }: ErrorProps) {
    super(message);
    this.name = this.constructor.name;
    this.httpCode = httpCode || StatusCodes.INTERNAL_SERVER_ERROR;
    this.message = message || errorMessages.InternalServerErrorMessage;
    this.verboseMessage = verboseMessage;
    this.errorType = errorType || errorTypes.INTERNAL_SERVER_ERROR;

    Error.captureStackTrace(this, () => logger.error(this));
  }
}
