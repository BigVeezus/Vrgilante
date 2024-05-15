import { env, generateReference, FirstTimeLoginException, BadRequestException } from '../../utils';
import { EditUserDTO, ForgotPasswordDTO, GetUserByRegistrationTokenDTO, GetUserDTO, LoginDTO, LogoutDTO, ResetPasswordDTO } from './users.interface';
import { IUser } from './models/users.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import usersRepository from './repositories/users.repository';
import mongoose from 'mongoose';
import oldPasswordRepository from './repositories/oldPassword.repository';
import revokedTokenRepository from './repositories/revokedToken.repository';
import { sendPasswordReset } from '../../modules/notification/mail/mailService';

export const login = async (params: LoginDTO) => {
  const { email, authType, password } = params;
  let user = await usersRepository.userProfileData({ email });
  if (!user) throw new BadRequestException({ message: 'Invalid credentials' });
  if (user.isBlocked) {
    throw new BadRequestException({ message: 'Account currently blocked' });
  }

  if (user.loginAttempts >= env('PASSWORD_TRIAL_LIMIT')) {
    // block the user
    await usersRepository.update(user._id, { isBlocked: true });
    throw new BadRequestException({ message: 'You exceeded the login attempts and account has been blocked.' });
  }
  if (!user.password || user.password?.length < 4) throw new BadRequestException({ message: 'User password has not been set' });

  if (authType == 'otp') handlOTPLogin(user);
  user = await handlePasswordCheck(password!, user);

  if (user.firstTimeLogin) throw new FirstTimeLoginException({ message: 'This your first time, kindly reset your password to continue' });

  const token = generateToken(user);
  await usersRepository.update(user._id, { loginAttempts: 0 });
  return {
    token,
    expires: new Date().setDate(new Date().getDate() + 1),
    user,
  };
};

export const profileDetails = async (user: IUser) => {
  delete user.password;
  delete user.passwordExpiry;
  delete user.passwordChangedAt;
  return user;
};

export const getUserID = async (params: GetUserDTO) => {
  return await usersRepository.userProfileData({ _id: new mongoose.Types.ObjectId(params.id) });
};

export const edit = async (params: EditUserDTO) => {
  // console.log(params.user._id);
  return await usersRepository.findOneAndUpdate(
    {
      _id: params.user._id,
    },
    {
      ...params,
    },
  );
};

export const userByRegistrationToken = async (params: GetUserByRegistrationTokenDTO) => {
  const user = await usersRepository.userProfileData({ registerUserToken: params.token });

  if (!user) throw new BadRequestException({ message: 'Invalid token passed' });

  return {
    firstName: user.firstName || null,
    lastName: user.lastName || null,
    email: user.email,
    userType: user.userType,
    role: user.role.slug,
  };
};

export const forgotPasswordRequest = async (params: ForgotPasswordDTO) => {
  const { email } = params;
  const user = await usersRepository.userProfileData({ email });
  if (!user) throw new BadRequestException({ message: 'Email not found' });
  try {
    const token = generateReference(20);
    await usersRepository.update(user._id, {
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 10800000, // 3 hours from now
    });
    sendPasswordReset({
      firstName: user.firstName,
      email: user.email,
      token,
    });
    return;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

export const passwordReset = async (params: ResetPasswordDTO) => {
  const { password, confirmPassword, token } = params;
  if (password != confirmPassword) throw new BadRequestException({ message: 'Password mismatch' });
  console.log('token', token);
  const user = await usersRepository.findOne({ resetPasswordToken: token });
  if (!user) throw new BadRequestException({ message: 'Password reset token is invalid' });
  if (new Date(user.resetPasswordExpires!) < new Date()) throw new BadRequestException({ message: 'Token expired' });
  const updatedUser = await handleUserPasswordReset(user, password);
  await oldPasswordRepository.savePassword(user._id, updatedUser.password!);

  return;
};

export const logout = async (params: LogoutDTO) => {
  await revokedTokenRepository.create({ token: params.token });
  return;
};

export const getRevokedToken = async (token: string) => {
  return revokedTokenRepository.findOne({ token });
};

const handleUserPasswordReset = async (user: IUser, password: string) => {
  const checkOldPassword = await oldPasswordRepository.checkOldPasswords(user._id, password);
  if (checkOldPassword) throw new BadRequestException({ message: 'Password has previously been used.Try another password' });
  user.password = await usersRepository.hashPassword(password);
  user.resetPasswordExpires = null;
  user.resetPasswordToken = '';
  user.loginAttempts = 0;
  user.status = 'active';
  user.isBlocked = false;
  user.active = true;
  user.firstTimeLogin = false;
  await usersRepository.update(user._id.toString(), user);
  return user;
};
const handlePasswordCheck = async (password: string, user: IUser) => {
  const isPasswordValid = await bcrypt.compare(password, user.password!);
  const loginAttempts = user.loginAttempts + 1;
  const numberOfTimeLeft = +env('PASSWORD_TRIAL_LIMIT') - loginAttempts;
  let errorMsg = `Invalid credentails. And you have ${numberOfTimeLeft} trials left`;
  if (numberOfTimeLeft == 0) {
    errorMsg = `Invalid credentails.And you exceeded the trails limit`;
  }
  if (!isPasswordValid) {
    await usersRepository.update(user._id.toString(), { $inc: { loginAttempts: 1 } });
    throw new BadRequestException({ message: errorMsg });
  }
  delete user.password;
  delete user.passwordExpiry;
  delete user.passwordChangedAt;
  return user;
};
const handlOTPLogin = (user: IUser) => {
  return user;
};

const generateToken = (user: IUser) => {
  const token = jwt.sign(
    {
      iss: env('JWT_ISSUER'),
      aud: env('JWT_AUDIENCE'),
      sub: user._id,
      iat: Math.floor(new Date().getTime() / 1000),
      permissions: user.role?.permissions,
    },
    `${env('JWT_SECRET')}`,
    {
      expiresIn: '1d',
    },
  );
  return token;
};
