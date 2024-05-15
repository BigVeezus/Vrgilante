import { StatusCodes } from 'http-status-codes';
import { BaseError } from './BaseError';
import { ErrorProps } from './errorsInterface';
import { errorTypes, errorMessages } from './errorsConstants';

export class UnprocessableEntityError extends BaseError {
  constructor({ message, verboseMessage }: ErrorProps) {
    super({
      message: message || errorMessages.unprocessableEntityErrorMessage,
      httpCode: StatusCodes.UNPROCESSABLE_ENTITY,
      errorType: errorTypes.UNPROCESSABLE_ENTITY,
      verboseMessage,
    });
  }
}

export class JoiValidationError extends BaseError {
  constructor({ message, verboseMessage }: ErrorProps) {
    const errors = verboseMessage.details.map((err: any) => {
      return {
        message: `${resolveMessage(err.message, err.path)}`,
        path: err.path,
        type: err.type,
      };
    });
    const errorMessages = errors.map((error: any) => error.message);

    super({
      message: errorMessages.join(', '),
      httpCode: StatusCodes.UNPROCESSABLE_ENTITY,
      errorType: errorTypes.VALIDATION_FAILED,
      verboseMessage: errorMessages,
    });
  }
}

function resolveMessage(message: string, path: string[]) {
  const refinedMessage = message.replace(/["']+/g, '');
  if (path.length > 1) {
    return `${refinedMessage} (${path.join('->')})`;
  }

  return refinedMessage;
}
