import * as roleService from './role.service';

export const getRoles = async () => {
  const data = await roleService.getRoles();
  //send mail
  return {
    data,
    message: 'Sucessfully got roles',
  };
};
