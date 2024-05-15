import Joi from 'joi';

export const LoginValidationSchema = Joi.object().keys({
  email: Joi.string().email().trim().lowercase().required(),
  authType: Joi.string().trim().required().valid('otp', 'password'),
  otp: Joi.string().trim().when('authType', { is: 'otp', then: Joi.required() }),
  password: Joi.string().trim().when('authType', { is: 'password', then: Joi.required() }),
});

export const EditUserValidationSchema = Joi.object().keys({
  user: Joi.object().required(),
  gender: Joi.string().trim().optional(),
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  email: Joi.string().email().trim().optional(),
});

export const GetUserByRegistrationTokenValidation = Joi.object().keys({
  token: Joi.string().trim().required(),
});

export const ResetPasswordValidation = Joi.object().keys({
  password: Joi.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&*])/)
    .message('Password must be at least 8 characters long, containing at least on lowercase  letter, one uppercase letter, one number and one special character (!@#$%&*)')
    .required(),
  confirmPassword: Joi.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&*])/)
    .message('Password must be at least 8 characters long, containing at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%&*)')
    .required(),
  token: Joi.string().trim().required(),
});

export const forgotPasswordValidation = Joi.object().keys({
  email: Joi.string().email().trim().lowercase().required(),
});

export const logoutValidation = Joi.object().keys({
  token: Joi.string().required(),
});
