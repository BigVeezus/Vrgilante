import Joi from 'joi';
import { JoiValidationError } from './';

export const validate = <T>(data: T, schema: Joi.Schema): T => {
  const { error, value } = schema.validate(data);

  if (error) {
    throw new JoiValidationError({
      message: 'Error occurred during payload validation',
      verboseMessage: error,
    });
  }

  return value;
};
