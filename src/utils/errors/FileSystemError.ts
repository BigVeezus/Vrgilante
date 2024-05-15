import { StatusCodes } from 'http-status-codes';
import { BaseError } from './BaseError';
import { ErrorProps } from './errorsInterface';
import { errorTypes, errorMessages } from './errorsConstants';

export class FileSystemError extends BaseError {
  constructor({ message, verboseMessage }: ErrorProps) {
    super({
      message: message || errorMessages.fileSystemErrorMessage,
      httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errorType: errorTypes.FILE_SYSTEM_ERROR,
      verboseMessage,
    });
  }
}
