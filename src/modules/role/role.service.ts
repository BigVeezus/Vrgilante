import roleRepository from './role.repository';

export const getRoles = async () => {
  return await roleRepository.find({ type: 'business' });
};
