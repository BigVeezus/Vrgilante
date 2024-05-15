import { validate } from '../../utils';
import { EditUserDTO, ForgotPasswordDTO, GetProfileDTO, GetUserByRegistrationTokenDTO, LoginDTO, LogoutDTO, ResetPasswordDTO } from './users.interface';
import * as userservice from './users.service';
import { EditUserValidationSchema, GetUserByRegistrationTokenValidation, LoginValidationSchema, ResetPasswordValidation, forgotPasswordValidation, logoutValidation } from './users.validation';

export const login = async (params: LoginDTO) => {
  const value = validate(params, LoginValidationSchema);
  const data = await userservice.login(value);
  return {
    data,
    message: 'User Login sucessfully',
  };
};

export const edit = async (params: EditUserDTO) => {
  const value = validate(params, EditUserValidationSchema);
  const data = await userservice.edit(value);
  return {
    data,
    message: 'User edited sucessfully',
  };
};

export const userProfileDetails = async (params: GetProfileDTO) => {
  const data = await userservice.profileDetails(params.user);
  return {
    data,
    message: 'User Profile Data',
  };
};

export const getUserByRegistrationToken = async (params: GetUserByRegistrationTokenDTO) => {
  const value = validate(params, GetUserByRegistrationTokenValidation);
  const data = await userservice.userByRegistrationToken(value);
  return {
    data,
    message: 'User retrived successfully',
  };
};

export const firstTimePasswordSet = async (params: ResetPasswordDTO) => {
  const value = validate(params, ResetPasswordValidation);
  const data = await userservice.passwordReset(value);
  return {
    data,
    message: 'Password set successfully!',
  };
};

export const resetPassword = async (params: ResetPasswordDTO) => {
  const value = validate(params, ResetPasswordValidation);
  const data = await userservice.passwordReset(value);
  return {
    data,
    message: 'Password reset successfully',
  };
};

export const forgotPassword = async (params: ForgotPasswordDTO) => {
  const value = validate(params, forgotPasswordValidation);
  const data = await userservice.forgotPasswordRequest(value);
  return {
    data,
    message: 'A password reset has been mailed to your account',
  };
};

export const userLogout = async (params: LogoutDTO) => {
  const value = validate(params, logoutValidation);
  const data = await userservice.logout(value);
  return {
    data,
    message: 'User logout successful',
  };
};
