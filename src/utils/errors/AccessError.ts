import { StatusCodes } from 'http-status-codes';
import { BaseError } from './BaseError';
import { ErrorProps } from './errorsInterface';
import { errorTypes, errorMessages } from './errorsConstants';

export class AccessDeniedError extends BaseError {
  constructor({ message, verboseMessage }: ErrorProps) {
    super({
      message: message || errorMessages.accessDeniedErrorMessage,
      httpCode: StatusCodes.FORBIDDEN,
      errorType: errorTypes.ACCESS_DENIED,
      verboseMessage,
    });
  }
}

export class RequestedResourceDeniedError extends BaseError {
  constructor({ message, verboseMessage }: ErrorProps) {
    super({
      message: message || errorMessages.requestedResourceDeniedErrorMessage,
      httpCode: StatusCodes.FORBIDDEN,
      errorType: errorTypes.ACCESS_DENIED,
      verboseMessage,
    });
  }
}

export class UpdateAccessDeniedError extends BaseError {
  constructor({ message, verboseMessage }: ErrorProps) {
    super({
      message: message || errorMessages.updateAccessDeniedErrorMessage,
      httpCode: StatusCodes.FORBIDDEN,
      errorType: errorTypes.ACCESS_DENIED,
      verboseMessage,
    });
  }
}

export class DeleteAccessDeniedError extends BaseError {
  constructor({ message, verboseMessage }: ErrorProps) {
    super({
      message: message || errorMessages.deleteAccessDeniedErrorMessage,
      httpCode: StatusCodes.FORBIDDEN,
      errorType: errorTypes.ACCESS_DENIED,
      verboseMessage,
    });
  }
}

export class AuthenticationError extends BaseError {
  constructor({ message, verboseMessage }: ErrorProps) {
    super({
      message: message || errorMessages.authenticationErrorMessage,
      httpCode: StatusCodes.UNAUTHORIZED,
      errorType: errorTypes.USER_AUTHENTICATION_FALSE,
      verboseMessage,
    });
  }
}
