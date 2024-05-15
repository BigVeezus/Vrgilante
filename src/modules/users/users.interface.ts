import { IUser } from './models/users.model';

export interface LoginDTO {
  email: string;
  authType: string;
  password?: string;
  otp?: string;
}

export interface EditUserDTO {
  user: IUser;
  gender?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface GetUserDTO {
  id?: string;
  email?: string;
}

export interface GetProfileDTO {
  user: IUser;
}

export interface GetUserByRegistrationTokenDTO {
  token: string;
}

export interface ResetPasswordDTO {
  password: string;
  confirmPassword: string;
  token: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface LogoutDTO {
  token: string;
}

export interface PasswordSetFirsTimeDTO {
  token: string;
  newPassword: string;
}
