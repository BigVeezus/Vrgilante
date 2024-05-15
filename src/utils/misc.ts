import { logger } from './logger';
import { InternalServerError } from './errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

export const env = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    const envErrorMessage = `Missing: process.env['${name}'].`;
    logger.error(envErrorMessage);
    throw new InternalServerError({
      message: envErrorMessage,
      verboseMessage: value,
    });
  }

  return value;
};

export const isLengthy = (data: any): boolean => {
  return data && data.length > 0;
};

export const isNotLengthy = (data: any | undefined): boolean => {
  return !data || data.length <= 0;
};

export const isTruthy = <T>(data: T): boolean => {
  return data && data !== undefined;
};

export const isFalsy = <T>(data: T): boolean => {
  return !data || data === undefined || data === null;
};

export const isEmpty = (data: any): boolean => {
  return !data || data === undefined || data === null || data === '';
};

export const isNotEmpty = (data: any): boolean => {
  return data !== undefined && data !== null && data !== '';
};

export const objectHasKeys = <T>(data: T): boolean => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  return data && Object.keys(data).length > 0;
};

// export const formatObject = <T>(data: T, keysToInclude: string[]): T => {
//   if (!objectHasKeys(data)) {
//     return {} as T;
//   }

//   const newObject: any = {};
//   for (const [key, value] of Object.entries(data)) {
//     if (keysToInclude.includes(key)) {
//       newObject[key] = value;
//     }
//   }

//   return newObject as T;
// };

export const removeKeysFromObject = <T>(object: T, keys: string[]): T => {
  const newObject = {} as T;

  for (const key in { ...object }) {
    if (!keys.includes(key)) {
      newObject[key] = object[key];
    }
  }

  return newObject;
};

// export const objectCleanser = <T>(
//   obj: T,
//   cleanseOut: any[] = [null, "null", "", "0"]
// ): T => {
//   if (!objectHasKeys(obj)) {
//     return {} as T;
//   }

//   const newObject: any = {};
//   for (const [key, value] of Object.entries(obj)) {
//     if (!cleanseOut.includes(value)) {
//       newObject[key] = value;
//     }
//   }

//   return newObject as T;
// };

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const isPasswordSame = (plainPassword: string, hashedPassword: string) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

export const RoundNumber = (num: number, length: number) => {
  const number = Math.round(num * Math.pow(10, length)) / Math.pow(10, length);
  return number;
};

export const generateReference = (length: number): string => {
  const bytes = randomBytes(length);
  return bytes.toString('hex');
};

type Permission = {
  name: string;
  permission: string;
};

type Section = {
  name: string;
  permissions: Permission[];
};

export type RolePermissions = {
  role: string;
  name: string;
  slug?: string;
  isCustom: boolean;
  description: string;
  permissions: Section[];
};

export const getAllPermissions = (sections: Section[]): string[] => {
  const permissionsList: string[] = [];
  sections.forEach((section) => {
    section.permissions.forEach((permission) => {
      permissionsList.push(permission.permission);
    });
  });
  return permissionsList;
};

export const generateTemporaryPassword = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let idx = 0; idx < length; idx += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
};
